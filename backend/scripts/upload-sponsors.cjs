// backend/scripts/upload-sponsors.cjs
// Script to upload all sponsor logos from frontend/public/sponsors to Cloudinary
// and automatically update frontend/data/summitData.ts with the generated Cloudinary URLs.
//
// Run from backend folder with: node scripts/upload-sponsors.cjs

const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true,
});

const SPONSORS_DIR = path.join(__dirname, '..', '..', 'frontend', 'public', 'sponsors');
const SUMMIT_DATA_FILE = path.join(__dirname, '..', '..', 'frontend', 'data', 'summitData.ts');
const FOLDER = 'esummit/sponsors';

async function uploadSponsors() {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.error('❌ Error: CLOUDINARY_CLOUD_NAME is not set in backend/.env');
    process.exit(1);
  }

  if (!fs.existsSync(SPONSORS_DIR)) {
    console.error(`❌ Error: Sponsors directory not found at: ${SPONSORS_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(SPONSORS_DIR).filter((f) => /\.(png|svg|jpg|jpeg|webp)$/i.test(f));
  console.log(`\n🚀 Found ${files.length} sponsor logo(s) to upload to Cloudinary (folder: "${FOLDER}")...\n`);

  const mapping = {};

  for (const file of files) {
    const filePath = path.join(SPONSORS_DIR, file);
    const publicId = file.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');

    try {
      const res = await cloudinary.uploader.upload(filePath, {
        folder: FOLDER,
        public_id: publicId,
        overwrite: true,
        resource_type: 'auto',
      });
      mapping[file] = res.secure_url;
      console.log(`  ✓ ${file} → ${res.secure_url}`);
    } catch (err) {
      console.error(`  ✗ Failed to upload ${file}: ${err.message}`);
    }
  }

  // 1. Save mapping JSON file
  const mappingPath = path.join(__dirname, 'cloudinary-sponsors-mapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2), 'utf-8');
  console.log(`\n💾 Saved URL mapping to: ${path.relative(process.cwd(), mappingPath)}`);

  // 2. Automatically update frontend/data/summitData.ts
  if (fs.existsSync(SUMMIT_DATA_FILE)) {
    let content = fs.readFileSync(SUMMIT_DATA_FILE, 'utf-8');
    let replacementCount = 0;

    for (const [filename, cdnUrl] of Object.entries(mapping)) {
      const targetPattern = `/sponsors/${filename}`;
      if (content.includes(targetPattern)) {
        content = content.split(targetPattern).join(cdnUrl);
        replacementCount++;
      }
    }

    fs.writeFileSync(SUMMIT_DATA_FILE, content, 'utf-8');
    console.log(`\n✨ Automatically updated ${replacementCount} sponsor logo link(s) in:`);
    console.log(`   ${path.relative(process.cwd(), SUMMIT_DATA_FILE)}`);
  }

  console.log('\n✅ All sponsor logos uploaded and hardcoded data updated to Cloudinary!\n');
}

uploadSponsors().catch((err) => {
  console.error('\n❌ Fatal error:', err);
  process.exit(1);
});
