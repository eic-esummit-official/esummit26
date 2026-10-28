const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const result = await prisma.ventureXTestSubmission.deleteMany({})
  console.log(`Deleted ${result.count} test submission(s)`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
