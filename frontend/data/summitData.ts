// data/summitData.ts
// Master Centralized Single-Source-Of-Truth Data Repository for PEC E-Summit 2026

export interface Speaker {
  id: string
  name: string
  role: string
  company: string
  badge: string
  category: 'keynote' | 'panelist' | 'investor' | 'mentor'
  initials: string
  image?: string
  bio: string
  track: string
}

export interface EventItem {
  id: string
  number: string
  title: string
  category: string
  eyebrow: string
  image: string
  purpose: string
  delivery: string
  expectedParticipation: string
  tags: string[]
  partner?: string
  registrationUrl?: string | null
}

export interface AlumniItem {
  id: string
  name: string
  role: string
  company: string
  batch: string
  achievement: string
  image?: string
}

export interface SponsorItem {
  id: string
  name: string
  tier: 'Title Sponsor' | 'Powered By' | 'Associate Sponsor' | 'Ecosystem Partner' | 'Previous Sponsor'
  logo: string
  category: string
}

export interface FAQItem {
  id: string
  question: string
  answer: string
  category: 'General' | 'Passes' | 'Hackathon' | 'Pitch'
}

export const MASTER_SPEAKERS: Speaker[] = [
  {
    id: 'sp-1',
    name: 'Sandeep Jain',
    role: 'Founder',
    company: 'GeeksforGeeks',
    badge: 'EDTECH PIONEER',
    category: 'keynote',
    initials: 'SJ',
    image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/1.jpg',
    bio: 'Founder of GeeksforGeeks, one of the world’s largest computer science and coding education platforms empowering millions of engineers.',
    track: 'EdTech & Scaling Tech Platforms',
  },
  {
    id: 'sp-2',
    name: 'Saurabh Munjal',
    role: 'Co-Founder & CEO',
    company: 'Lahori Zeera',
    badge: 'D2C SCALE LEADER',
    category: 'keynote',
    initials: 'SM',
    image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1792025981/esummit/speakers/saurabh_munjal.jpg',
    bio: 'Co-Founder & CEO of Lahori Zeera, revolutionizing traditional beverage distribution across India with multi-crore FMCG distribution.',
    track: 'Consumer Brands & FMCG Scale',
  },
  {
    id: 'sp-3',
    name: 'Aditi Bhutia Madan',
    role: 'Founder',
    company: 'Momo Mami',
    badge: 'SHARK TANK FOUNDER',
    category: 'panelist',
    initials: 'AM',
    image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1792025983/esummit/speakers/aditi_madan.jpg',
    bio: 'Shark Tank India featured founder, master chef, and entrepreneur who scaled Momo Mami (BluePine Foods) into a pan-India frozen food brand.',
    track: 'FoodTech & Women Entrepreneurship',
  },
  {
    id: 'sp-4',
    name: 'Sourabh Goyal',
    role: 'Founder',
    company: 'SuccessBrew',
    badge: 'STARTUP ADVISOR',
    category: 'mentor',
    initials: 'SG',
    image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/4.jpg',
    bio: 'Founder of SuccessBrew, active angel investor and mentor coaching early-stage founders on product-market fit and venture scaling.',
    track: 'Venture Building & Growth',
  },
  {
    id: 'sp-5',
    name: 'Mandeep Kaur Tangra',
    role: 'Founder',
    company: 'SimbaQuartz',
    badge: 'RURAL INNOVATOR',
    category: 'panelist',
    initials: 'MK',
    image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/5.jpg',
    bio: 'Pioneered IT and technology empowerment in rural Punjab through SimbaQuartz, creating global software jobs in grassroots communities.',
    track: 'Social Impact & Tech Empowerment',
  },
  {
    id: 'sp-6',
    name: 'Aahan Khurma',
    role: 'Co-Founder & CEO',
    company: 'Wellversed',
    badge: 'HEALTH & NUTRITION',
    category: 'panelist',
    initials: 'AK',
    image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/6.jpg',
    bio: 'Co-Founder & CEO of Wellversed, building Asia’s largest wellness house of brands and nutritional science products.',
    track: 'D2C HealthTech & House of Brands',
  },
  {
    id: 'sp-7',
    name: 'Drishti Kharbanda',
    role: 'Founder',
    company: 'Bake Cosmetics',
    badge: 'BEAUTY & WELLNESS',
    category: 'panelist',
    initials: 'DK',
    image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/7.jpg',
    bio: 'Founder of Bake Cosmetics, pioneering organic skincare and clean beauty formulations with rapid D2C marketplace growth.',
    track: 'Consumer Goods & Digital Marketing',
  },
  {
    id: 'sp-8',
    name: 'Aseem Ghavri',
    role: 'Co-Founder',
    company: 'Third Unicorn',
    badge: 'TECH OPERATOR',
    category: 'keynote',
    initials: 'AG',
    image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/8.jpg',
    bio: 'Serial entrepreneur and Co-Founder at Third Unicorn (alongside Ashneer Grover) building disruptive fintech and fantasy tech products.',
    track: 'Fintech & Zero to One Ventures',
  },
  {
    id: 'sp-9',
    name: 'Varun Singla',
    role: 'Founder',
    company: 'Gate Smashers',
    badge: 'TOP EDUCATOR',
    category: 'keynote',
    initials: 'VS',
    image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1792025984/esummit/speakers/varun_singla.jpg',
    bio: 'Founder of Gate Smashers, India’s most popular computer science lecture channel mentoring 1.5M+ engineers across core fundamentals.',
    track: 'Engineering Education & Content Scale',
  },
  {
    id: 'sp-10',
    name: 'Sarvjeet Singh',
    role: 'Founder',
    company: 'Finvasia',
    badge: 'FINTECH TITAN',
    category: 'investor',
    initials: 'SS',
    image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/10.jpg',
    bio: 'Founder of Finvasia and Shoonya, leading multinational financial conglomerate operating across commission-free trading, banking, and forex.',
    track: 'Global Capital & Algorithmic Trading',
  },
  {
    id: 'sp-11',
    name: 'Paresh Gupta',
    role: 'Founder',
    company: 'CUETPro / GSEC / Brevity',
    badge: 'ECOSYSTEM STRATEGIST',
    category: 'mentor',
    initials: 'PG',
    image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/11.jpg',
    bio: '4x TEDx Speaker, serial entrepreneur, and mentor shaping incubation ecosystems and national startup strategy.',
    track: 'Startup Valuation & Incubation',
  },
  {
    id: 'sp-12',
    name: 'Sharad Sagar',
    role: 'Founder & CEO',
    company: 'Dexterity Global',
    badge: 'GLOBAL LEADER',
    category: 'keynote',
    initials: 'SS',
    image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/12.jpg',
    bio: 'Forbes 30 Under 30, Rockefeller Foundation Fellow, and President of Dexterity Global transforming youth leadership across India.',
    track: 'Global Leadership & Public Good',
  },
  {
    id: 'sp-13',
    name: 'Paritosh Anand',
    role: 'Founder',
    company: 'WeSmile / Believe Clothing',
    badge: 'CREATOR ECONOMY',
    category: 'panelist',
    initials: 'PA',
    image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/13.jpg',
    bio: 'Storyteller, founder of Believe Clothing and WeSmile media, inspiring millions of young creators and digital builders.',
    track: 'Creator Economy & Brand Storytelling',
  },
  {
    id: 'sp-14',
    name: 'Aditya Arora',
    role: 'Android Lead',
    company: 'SAP',
    badge: 'TECH ARCHITECT',
    category: 'panelist',
    initials: 'AA',
    image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/14.jpg',
    bio: 'Android Lead at SAP, angel investor in 25+ tech startups, and Microsoft Most Valuable Professional (MVP).',
    track: 'Enterprise Tech & Angel Investing',
  },
  {
    id: 'sp-15',
    name: 'Nandu Nandkishore',
    role: 'Former Global CEO',
    company: 'Nestlé Nutrition',
    badge: 'FORTUNE 500 LEADER',
    category: 'keynote',
    initials: 'NN',
    image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/15.jpg',
    bio: 'Former Executive Board Member at Nestlé S.A. and Global CEO of Nestlé Nutrition, corporate strategist, and investor at London Business School.',
    track: 'Global Scale & Corporate Governance',
  },
  {
    id: 'sp-16',
    name: 'Daksh Sethi',
    role: 'Founder & CEO',
    company: 'Guby Rogers',
    badge: 'YOUTH CATALYST',
    category: 'panelist',
    initials: 'DS',
    image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/16.jpg',
    bio: 'Founder of Guby Rogers, keynote speaker, and soft skills accelerator empowering students to crack corporate and founder careers.',
    track: 'Personal Branding & Career Velocity',
  },
  {
    id: 'sp-17',
    name: 'Hardik Banga',
    role: 'Co-Founder',
    company: 'Adsworm',
    badge: 'PERFORMANCE MEDIA',
    category: 'mentor',
    initials: 'HB',
    image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/17.jpg',
    bio: 'Co-Founder of Adsworm, performance marketing strategist and digital media accelerator helping startups scale customer acquisition.',
    track: 'Growth Hacking & Ad Networks',
  },
  {
    id: 'sp-18',
    name: 'Rupinder Singh',
    role: 'Founder',
    company: 'Bio House / Mentor / Investor',
    badge: 'ANGEL INVESTOR',
    category: 'investor',
    initials: 'RS',
    image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/3.jpg',
    bio: 'Founder of Bio House, seasoned life sciences investor, and startup mentor driving biotechnology and hardware incubation.',
    track: 'BioTech & Seed Stage Deals',
  },
]

export const MASTER_EVENTS: EventItem[] = [
  {
    id: 'ev-1',
    number: '01',
    title: 'EIC VentureX',
    category: 'Hackathon',
    eyebrow: 'IDEA TO IMPACT',
    image: '/EIC_VentureX.jpeg',
    purpose: 'High-energy innovation sprint where ideas turn into working solutions and tech prototypes fast.',
    delivery: '24-Hour continuous sprint, mentor checkpoint reviews, and live product demos before judges.',
    expectedParticipation: '500+ Hackers across 120 Teams',
    tags: ['AI & ML', 'Full-Stack', 'Open Source', '₹5.0L Prize Pool'],
    partner: 'Google Cloud & GitHub',
    registrationUrl: 'https://unstop.com/hackathons/eic-venturex-idea-to-impact-punjab-engineering-college-pec-chandigarh-1750271',
  },
  {
    id: 'ev-2',
    number: '02',
    title: 'Bazaar',
    category: 'Marketplace',
    eyebrow: 'EXPERIENCE REAL-TIME TRADING',
    image: '/EIC_Bazaar.jpeg',
    purpose: 'Experience real-time trading simulation and live marketplace for student-run D2C brands, products, and pop-ups.',
    delivery: '2-Day dedicated exhibition area with thousands of attendee walk-ins and live sales.',
    expectedParticipation: '25+ Student Ventures',
    tags: ['D2C Pop-ups', 'Student Stalls', 'Live Trading'],
    partner: 'E-Cell PEC Community',
    registrationUrl: 'https://unstop.com/hackathons/beat-the-markets-punjab-engineering-college-pec-chandigarh-1769112',
  },
  {
    id: 'ev-3',
    number: '03',
    title: 'Funding Conclave',
    category: 'Venture Capital',
    eyebrow: 'IDEAS. INVESTORS. IMPACT.',
    image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1787412311/esummit/gallery/pec_funding_conclave.png',
    purpose: 'A high-stakes live pitching stage where high-potential startup founders present their ventures before active angel investors, venture capitalists, and an audience of over 400 attendees to secure funding and strategic backing.',
    delivery: 'Live Pitching on stage, real-time evaluation from an esteemed investor panel, and dedicated post-pitch investor connect for term sheets, syndicates, and strategic mentorship.',
    expectedParticipation: '400+ Attendees & 20+ Top VCs',
    tags: ['Live Pitching', 'Investor Connect', 'Term Sheets', 'Angel Networks'],
    partner: 'Finvasia & Chandigarh Angels Network',
    registrationUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdCQD5AsxO9yeKnYon-wMBNshPg3A1Bl5k1w6CEBify0a2YDg/viewform',
  },
  {
    id: 'ev-4',
    number: '04',
    title: 'Networking Lunch',
    category: 'Networking',
    eyebrow: 'HIGH-INTENT CONVERSATIONS',
    image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1787412306/esummit/gallery/pec_auditorium.png',
    purpose: 'An exclusive, closed-door networking luncheon designed to connect startup founders, institutional investors, keynote speakers, and industry alumni in an informal yet focused setting.',
    delivery: 'Curated introductions aligned by sector & investment stage, casual open dialogue, and dedicated windows for warm contacts and one-on-one follow-up meetings.',
    expectedParticipation: 'Exclusive · Invite-Only',
    tags: ['Curated Introductions', 'Open Dialogue', 'Actionable Follow-Through'],
    partner: 'CII & Young Indians',
    registrationUrl: null,
  },
  {
    id: 'ev-5',
    number: '05',
    title: 'Expert Sessions',
    category: 'Speakers & Panels',
    eyebrow: 'INSIGHT THAT MOVES INTO ACTION',
    image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1787412321/esummit/gallery/pec_keynote_speaker.png',
    purpose: 'Flagship keynote sessions, masterclasses, and thought-provoking group debates led by visionary entrepreneurs, venture capitalists, and industry disruptors.',
    delivery: 'Unfiltered founder playbooks covering early pivots & fundraising journeys, and diverse panel debates contrasting founder agility with investor expectations.',
    expectedParticipation: '1,000+ Attendees',
    tags: ['Keynotes', 'Masterclasses', 'Panel Debates', 'Founder Playbooks'],
    partner: 'PEC E-Cell',
    registrationUrl: null,
  },
  {
    id: 'ev-6',
    number: '06',
    title: 'Startup Expo',
    category: 'Deep Tech & Expo',
    eyebrow: 'BE SEEN BY THE RIGHT PEOPLE',
    image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1787412331/esummit/gallery/pec_senate_roundtable.png',
    purpose: 'The central discovery floor of E-Summit 2026, where emerging startups, student-led ventures, and research-backed innovators exhibit working prototypes, demonstrate live products, and engage directly with the ecosystem.',
    delivery: 'Dedicated exhibition stalls (incl. 10x10 ft prime booths) for live demos, access to 4,000+ attendees for beta users & talent, and curated investor/mentor walkthroughs at founder stalls.',
    expectedParticipation: '4,000+ Attendees & 40+ Exhibits',
    tags: ['Live Demos', 'Investor Walkthroughs', 'Talent Discovery', 'Market Feedback'],
    partner: 'PEC Research & Consultation Wing',
    registrationUrl: null,
  },
  {
    id: 'ev-7',
    number: '07',
    title: 'Talent & Intern Fair',
    category: 'Career Fair',
    eyebrow: 'MEET PEOPLE WHO ARE READY TO BUILD.',
    image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1787412333/esummit/gallery/pec_startup_fair.png',
    purpose: 'A focused bridge between high-intent students and organizations looking for interns, collaborators, campus ambassadors, and early-career talent.',
    delivery: 'On-spot resume reviews, technical interviews, and real role access. For startups: versatile early team members. For companies: technical & entrepreneurial talent.',
    expectedParticipation: '800+ Students & 35+ Companies',
    tags: ['Startups & Companies', 'Paid Roles', 'Direct Hiring', 'Campus Ambassadors'],
    partner: 'PEC Training & Placement Cell',
    registrationUrl: null,
  },
]

export const MASTER_ALUMNI: AlumniItem[] = [
  {
    id: 'al-1',
    name: 'Kalpana Chawla',
    role: 'Astronaut & Aerospace Pioneer',
    company: 'NASA',
    batch: "PEC '82 (Aeronautical)",
    achievement: 'First woman of Indian origin in space; Global icon of aerospace engineering courage and vision.',
    image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1790450613/esummit/alumni/OIP.webp',
  },
  {
    id: 'al-2',
    name: 'Satish Dhawan',
    role: 'Former Chairman',
    company: 'ISRO',
    batch: "PEC '38 (Mechanical)",
    achievement: 'Father of experimental fluid dynamics research in India; Led ISRO during the transformative satellite launch era.',
    image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1790450614/esummit/alumni/OIP__1__jpg.jpg',
  },
  {
    id: 'al-3',
    name: 'Jaspal Bhatti',
    role: 'Iconic Satirist & Film Pioneer',
    company: 'Flop Show & Media Studio',
    batch: "PEC '78 (Electrical)",
    achievement: 'Padma Bhushan Awardee; Legendary creator who redefined television satire and independent media in India.',
    image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1790450615/esummit/alumni/OIP__2__jpg.jpg',
  },
  {
    id: 'al-4',
    name: 'Gajendra Jangid',
    role: 'Co-Founder & CMO',
    company: 'CARS24',
    batch: "PEC '05",
    achievement: 'Scaled CARS24 to a $3.3B+ valuation unicorn across 4 countries.',
    image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1790450622/esummit/alumni/1786383606538.png',
  },
  {
    id: 'al-5',
    name: 'Padmasree Warrior',
    role: 'Founder & CEO',
    company: 'Fable',
    batch: "PEC '82",
    achievement: 'Former CTO of Cisco & Motorola; Board member at Microsoft and Spotify.',
    image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1790450616/esummit/alumni/OIP__3__jpg.jpg',
  },
  {
    id: 'al-6',
    name: 'Steve Sanghi',
    role: 'Executive Chairman',
    company: 'Microchip Technology',
    batch: "PEC '75",
    achievement: 'Led Microchip Technology from early stage to a $40B+ Nasdaq semiconductor giant.',
    image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1790450618/esummit/alumni/OIP__4__jpg.jpg',
  },
  {
    id: 'al-7',
    name: 'Kunwar Sachdev',
    role: 'Founder & Innovator',
    company: 'Su-Kam Power Systems',
    batch: "PEC '84",
    achievement: 'Known as the "Solar Man of India"; Revolutionized renewable energy systems across 70+ countries.',
    image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1791748759/esummit/alumni/kunwar_sachdev.jpg',
  },
  {
    id: 'al-8',
    name: 'Dr. Ritesh Malik',
    role: 'Founder',
    company: 'Innov8 Coworking',
    batch: 'Mentor & Partner',
    achievement: 'Forbes 30 Under 30 Asia; Scaled Innov8 to exit and angel invested in 80+ Indian startups.',
    image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1791748760/esummit/alumni/ritesh_malik.webp',
  },
  {
    id: 'al-9',
    name: 'Prof. Vijay K. Dhir',
    role: 'Former Dean of Engineering',
    company: 'UCLA Samueli School',
    batch: "PEC '65",
    achievement: 'National Academy of Engineering; Space shuttle heat-shield physics pioneer.',
    image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1790450619/esummit/alumni/OIP__6__jpg.jpg',
  },
  {
    id: 'al-10',
    name: 'D.C. Anand',
    role: 'Founder & Chairman',
    company: 'ANAND Group India',
    batch: "PEC '52",
    achievement: 'Pioneer of precision automotive component manufacturing in India with 19 tier-1 companies.',
    image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1791748761/esummit/alumni/dc_anand.jpg',
  },
]

export const MASTER_SPONSORS: SponsorItem[] = [
  { id: 'sp-1', name: 'Finvasia', tier: 'Title Sponsor', logo: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1792236587/esummit/sponsors/finvasia.svg', category: 'Fintech & Trading' },
  { id: 'sp-2', name: 'SBI (State Bank of India)', tier: 'Powered By', logo: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1792236594/esummit/sponsors/sbi.png', category: 'Banking Partner' },
  { id: 'sp-3', name: 'Fireside Ventures', tier: 'Associate Sponsor', logo: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1792236589/esummit/sponsors/fireside.png', category: 'Venture Capital' },
  { id: 'sp-4', name: 'Amar Ujala', tier: 'Ecosystem Partner', logo: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1792236581/esummit/sponsors/amarujala.png', category: 'Media Partner' },
  { id: 'sp-5', name: 'CII (Confederation of Indian Industry)', tier: 'Ecosystem Partner', logo: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1792236583/esummit/sponsors/cii.png', category: 'Industry Partner' },
  { id: 'sp-6', name: 'uTrade', tier: 'Ecosystem Partner', logo: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1792236600/esummit/sponsors/utrade.png', category: 'Algorithmic Trading' },
  { id: 'sp-7', name: 'Monster Energy', tier: 'Ecosystem Partner', logo: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1792236591/esummit/sponsors/monster.png', category: 'Energy Drink Partner' },
  { id: 'sp-8', name: 'Vivo', tier: 'Ecosystem Partner', logo: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1792236604/esummit/sponsors/vivo.svg', category: 'Smartphone Partner' },
  { id: 'sp-9', name: 'Chiratae Ventures', tier: 'Associate Sponsor', logo: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1792236582/esummit/sponsors/chiratae.png', category: 'Venture Capital' },
  { id: 'sp-10', name: 'Shree Ganesh (South Indian Food)', tier: 'Ecosystem Partner', logo: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1792236598/esummit/sponsors/shreeganesh.png', category: 'Food Partner' },
  { id: 'sp-11', name: 'Shoutlo', tier: 'Ecosystem Partner', logo: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1792236597/esummit/sponsors/shoutlo.png', category: 'Local Discovery' },
  { id: 'sp-12', name: 'Young Indians (Yi)', tier: 'Ecosystem Partner', logo: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1792236606/esummit/sponsors/youngindians.png', category: 'Youth Leadership' },
  { id: 'sp-13', name: 'Dainik Bhaskar', tier: 'Ecosystem Partner', logo: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1792236585/esummit/sponsors/dainikbhaskar.png', category: 'Print Media' },
  { id: 'sp-14', name: 'CityWoofer', tier: 'Ecosystem Partner', logo: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1792236584/esummit/sponsors/citywoofer.png', category: 'Ticketing & Events' },
  { id: 'sp-15', name: 'Venture Wolf', tier: 'Ecosystem Partner', logo: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1792236601/esummit/sponsors/venturewolf.png', category: 'Startup Accelerator' },
  { id: 'sp-16', name: "Victoria's Cafe", tier: 'Ecosystem Partner', logo: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1792236602/esummit/sponsors/victoriascafe.png', category: 'Hospitality' },
  { id: 'sp-17', name: 'JAL', tier: 'Ecosystem Partner', logo: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1792236590/esummit/sponsors/jal.png', category: 'Hydration Partner' },
  { id: 'sp-18', name: 'CITCO', tier: 'Ecosystem Partner', logo: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1792236584/esummit/sponsors/citco.png', category: 'Tourism Partner' },
  { id: 'sp-19', name: 'Smaaash', tier: 'Ecosystem Partner', logo: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1792236599/esummit/sponsors/smaaash.png', category: 'Gaming & Entertainment' },
  { id: 'sp-20', name: 'Decathlon Play', tier: 'Ecosystem Partner', logo: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1792236586/esummit/sponsors/decathlon.png', category: 'Sports & Active' },
  { id: 'sp-21', name: 'Shoonya', tier: 'Ecosystem Partner', logo: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1792236595/esummit/sponsors/shoonya.svg', category: 'Zero-Brokerage Trading' },
  { id: 'sp-22', name: 'Rebel Foods', tier: 'Ecosystem Partner', logo: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1792236592/esummit/sponsors/rebelfoods.svg', category: 'Cloud Kitchen Partner' },
]

export interface TimelineEvent {
  id: string
  day: 1 | 2
  dayLabel: string
  date: string
  time: string
  title: string
  category: 'Keynote' | 'Hackathon' | 'Expo' | 'Competition' | 'Workshop' | 'Networking' | 'Culture'
  eyebrow: string
  venue: string
  description: string
  tags: string[]
  badge?: string
  featured?: boolean
  eventId?: string
}



export const MASTER_TIMELINE: TimelineEvent[] = [
  // DAY 1 — Saturday, November 14, 2026
  {
    id: 'time-d1-1',
    day: 1,
    dayLabel: 'DAY 01',
    date: 'Saturday, November 14, 2026',
    time: '09:00 AM – 10:30 AM',
    title: 'Inaugural Ceremony & Keynote Address',
    category: 'Keynote',
    eyebrow: 'HONORING THE PAST · INNOVATING THE FUTURE',
    venue: 'Main Auditorium',
    description: 'Formal inauguration of E-Summit 2026, institute leadership address, and keynote speech by pioneering industry titans.',
    tags: ['Inaugural', 'Keynote', 'Leadership'],
    badge: 'FLAGSHIP',
    featured: true,
  },
  {
    id: 'time-d1-2',
    day: 1,
    dayLabel: 'DAY 01',
    date: 'Saturday, November 14, 2026',
    time: '10:30 AM – 06:00 PM',
    title: 'Startup Expo & Science Fair Floor Opens',
    category: 'Expo',
    eyebrow: 'BE SEEN BY THE RIGHT PEOPLE',
    venue: 'Central Lawns & Exhibition Hall',
    description: 'Live discovery floor for student ventures, emerging startups, research-led ideas, and applied innovation demonstrations.',
    tags: ['DeepTech', 'Prototypes', 'Discovery Floor'],
    badge: 'ALL-DAY',
    eventId: 'ev-8',
  },
  {
    id: 'time-d1-3',
    day: 1,
    dayLabel: 'DAY 01',
    date: 'Saturday, November 14, 2026',
    time: '11:00 AM – 12:00 PM',
    title: '24-Hour Hackathon Flag-Off',
    category: 'Hackathon',
    eyebrow: 'IDEAS TURN INTO SOLUTIONS FAST',
    venue: 'Hack Arena (Centenary Hall)',
    description: 'Problem statement reveal and continuous 24-hour sprint kickoff for 120+ developer teams competing for the ₹5.0L prize pool.',
    tags: ['24-Hour Sprint', 'AI & Web3', '₹5.0L Prize'],
    badge: '24-HR CONTINUOUS',
    featured: true,
    eventId: 'ev-1',
  },
  {
    id: 'time-d1-4',
    day: 1,
    dayLabel: 'DAY 01',
    date: 'Saturday, November 14, 2026',
    time: '12:00 PM – 07:00 PM',
    title: 'E-Bazaar: Real-Time Trading & Flea Market',
    category: 'Competition',
    eyebrow: 'EXPERIENCE REAL-TIME TRADING',
    venue: 'PEC Main Boulevard',
    description: 'Live marketplace and trading simulation for student-run D2C brands, physical merchandise, and innovative consumer pop-ups.',
    tags: ['D2C Pop-ups', 'Trading Simulation', 'Live Sales'],
    eventId: 'ev-6',
  },
  {
    id: 'time-d1-5',
    day: 1,
    dayLabel: 'DAY 01',
    date: 'Saturday, November 14, 2026',
    time: '01:30 PM – 03:00 PM',
    title: 'Expert Sessions: Founder Journeys & Scaling',
    category: 'Workshop',
    eyebrow: 'INSIGHT THAT MOVES INTO ACTION',
    venue: 'Senate Hall',
    description: 'Candid discussions on venture building, market shifts, leadership decisions, and lessons rarely shared in textbooks.',
    tags: ['Founder Stories', 'Scale', 'Zero to One'],
  },
  {
    id: 'time-d1-6',
    day: 1,
    dayLabel: 'DAY 01',
    date: 'Saturday, November 14, 2026',
    time: '03:15 PM – 04:45 PM',
    title: 'Hands-on Workshops: Product, Growth & AI',
    category: 'Workshop',
    eyebrow: 'PRACTICAL SKILL SESSIONS',
    venue: 'Seminar Hall 1 & 2',
    description: 'Actionable masterclasses covering market validation, tech architecture, unit economics, and AI-driven growth tactics.',
    tags: ['Validation', 'Unit Economics', 'Growth Tools'],
  },
  {
    id: 'time-d1-7',
    day: 1,
    dayLabel: 'DAY 01',
    date: 'Saturday, November 14, 2026',
    time: '05:00 PM – 06:45 PM',
    title: 'Game of Brands & Biz Quiz Arena',
    category: 'Competition',
    eyebrow: 'INNOVATIVE & ENGAGING TRIVIA',
    venue: 'Main Auditorium',
    description: 'High-voltage trivia and buzzer battle testing business world acumen, brand identity, and venture strategy.',
    tags: ['Brand Trivia', 'Buzzer Rounds', 'Cash Awards'],
    eventId: 'ev-7',
  },
  {
    id: 'time-d1-8',
    day: 1,
    dayLabel: 'DAY 01',
    date: 'Saturday, November 14, 2026',
    time: '07:00 PM – 08:30 PM',
    title: 'Campus Treasure Hunt & Cultural Mixer',
    category: 'Culture',
    eyebrow: 'TEAMWORK & EXPLORATION',
    venue: 'Open Lawns & Campus Checkpoints',
    description: 'Campus-wide clue checkpoints, problem solving, exploration, and community networking under the stars.',
    tags: ['Treasure Hunt', 'Team Quest', 'Exclusive Merch'],
    eventId: 'ev-11',
  },

  // DAY 2 — Sunday, November 15, 2026
  {
    id: 'time-d2-1',
    day: 2,
    dayLabel: 'DAY 02',
    date: 'Sunday, November 15, 2026',
    time: '09:30 AM – 12:30 PM',
    title: 'Funding Conclave: Curated VC Pitching',
    category: 'Networking',
    eyebrow: 'CAPITAL, WITHOUT THE THEATRE',
    venue: 'Senate Hall & Private Boardrooms',
    description: 'High-context pitching where promising early-stage ventures meet tier-1 investors, funds, and active angel syndicates.',
    tags: ['Curated Dealflow', 'VCs & Angels', 'Term Sheets'],
    badge: 'FLAGSHIP',
    featured: true,
    eventId: 'ev-3',
  },
  {
    id: 'time-d2-2',
    day: 2,
    dayLabel: 'DAY 02',
    date: 'Sunday, November 15, 2026',
    time: '10:30 AM – 02:00 PM',
    title: 'Talent Fair (Internship & Job Fair)',
    category: 'Networking',
    eyebrow: 'MEET PEOPLE WHO ARE READY TO BUILD',
    venue: 'Academic Block Atrium',
    description: 'Direct bridge between 800+ top engineering candidates and 35+ companies & funded startups hiring for paid roles.',
    tags: ['Startups & Tech', 'Paid Roles', 'Interviews'],
    badge: 'HIRING ARENA',
    featured: true,
    eventId: 'ev-2',
  },
  {
    id: 'time-d2-3',
    day: 2,
    dayLabel: 'DAY 02',
    date: 'Sunday, November 15, 2026',
    time: '11:30 AM – 01:00 PM',
    title: 'Women Founders + Alumni Connect',
    category: 'Networking',
    eyebrow: 'COMMUNITIES THAT COMPOUND AMBITION',
    venue: 'Incubation Centre Lounge',
    description: 'Keynotes and closed-door circles spotlighting women entrepreneurs alongside distinguished PEC alumni operators.',
    tags: ['Women in Tech', 'Alumni Mentors', 'Peer Circles'],
    eventId: 'ev-10',
  },
  {
    id: 'time-d2-4',
    day: 2,
    dayLabel: 'DAY 02',
    date: 'Sunday, November 15, 2026',
    time: '01:30 PM – 03:45 PM',
    title: 'IPL Auction Strategy Challenge',
    category: 'Competition',
    eyebrow: 'REAL-TIME SIMULATION',
    venue: 'Main Auditorium',
    description: 'Experience real-time simulated IPL bidding hall testing budget allocation, player valuation, and live bids.',
    tags: ['Live Auction', 'Budget Strategy', '₹1.0L Prize'],
    featured: true,
    eventId: 'ev-4',
  },
  {
    id: 'time-d2-5',
    day: 2,
    dayLabel: 'DAY 02',
    date: 'Sunday, November 15, 2026',
    time: '02:00 PM – 04:30 PM',
    title: 'Build & Pitch Grand Finals',
    category: 'Competition',
    eyebrow: 'BUILD AND PITCH',
    venue: 'Senate Hall',
    description: 'Top student concepts pitch before institutional investors and VC partners for equity backing and incubation grants.',
    tags: ['Brand Pitch', 'Term Sheets', 'Grant Pool'],
    eventId: 'ev-5',
  },
  {
    id: 'time-d2-6',
    day: 2,
    dayLabel: 'DAY 02',
    date: 'Sunday, November 15, 2026',
    time: '04:00 PM – 05:30 PM',
    title: 'Hackathon Demos & E-Sports Showdown',
    category: 'Hackathon',
    eyebrow: 'LIVE DEMOS & ARENA CLASH',
    venue: 'Centenary Hall & Gaming Arena',
    description: 'Hackathon finalist product demos before the grand jury, concurrently with competitive E-Sports championship finals.',
    tags: ['Product Demos', 'E-Sports Finals', 'Live Jury'],
    eventId: 'ev-1',
  },
  {
    id: 'time-d2-7',
    day: 2,
    dayLabel: 'DAY 02',
    date: 'Sunday, November 15, 2026',
    time: '06:00 PM – 08:30 PM',
    title: 'Stand-up Comedy Night & Valedictory Awards',
    category: 'Culture',
    eyebrow: 'WIT, TIMING & CLOSING CELEBRATION',
    venue: 'PEC Open Air Theatre',
    description: 'Live performance by prominent stand-up comedians followed by the grand felicitation of competition winners and sponsors.',
    tags: ['Stand-up Comedy', 'Valedictory', 'Award Night'],
    badge: 'GRAND FINALE',
    featured: true,
    eventId: 'ev-12',
  },
]



export const MASTER_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Who can attend PEC E-Summit 2026?',
    answer: 'E-Summit 2026 is open to student innovators, developers, creators, early-stage founders, investors, and industry professionals from across India. Join us on November 14–15, 2026 at Punjab Engineering College, Chandigarh.',
    category: 'General',
  },
  {
    id: 'faq-2',
    question: 'Are registration passes free?',
    answer: 'General Student Delegate Passes and Campus Ambassador Passes are 100% FREE. Specific competition tracks like the 24-Hour Hackathon and Build & Pitch may include small delegate confirmation fees for prize pools.',
    category: 'Passes',
  },
  {
    id: 'faq-3',
    question: 'How do I check in at the venue on November 14–15, 2026?',
    answer: 'Once registered, your digital E-Badge with a unique cryptographic QR code is generated instantly. Present your digital badge on your smartphone at the PEC Main Gate entry scanners.',
    category: 'Passes',
  },
  {
    id: 'faq-4',
    question: 'What are the cash prizes for competitions?',
    answer: 'Competitions feature major prize pools across tracks, including the 24-Hour Hackathon (₹5.0 Lakhs), Build & Pitch Competition, IPL Auction Strategy, and Biz Quiz.',
    category: 'Pitch',
  },
  {
    id: 'faq-5',
    question: 'Are accommodation options available for outstation participants?',
    answer: 'Yes! Subsidized campus hostel accommodation and guest house allocations are provided on a first-come, first-served basis for confirmed outstation participants with an active E-Summit pass.',
    category: 'General',
  },
]

export const MASTER_STATS = [
  { label: 'Total Footfall', value: 5000, suffix: '+', id: 'footfall', display: '5K+' },
  { label: 'Startups Attended', value: 50, suffix: '+', id: 'startups', display: '50+' },
  { label: 'Workshops Conducted', value: 50, suffix: '+', id: 'workshops', display: '50+' },
  { label: 'Speaker Sessions', value: 30, suffix: '+', id: 'speakers', display: '30+' },
  { label: 'Event Participation', value: 3000, suffix: '+', id: 'participation', display: '3K+' },
  { label: 'Alumni Support', value: 1000, suffix: '+', id: 'alumni', display: '1K+' },
]

export const MASTER_CONTACTS = {
  studentLeadership: [
    { role: 'Convener', name: 'Vansh Gupta', phone: '+91 90413 09108' },
    { role: 'Convener', name: 'Bhrigu Verma', phone: '+91 94783 35331' },
  ],
  location: 'Entrepreneurship & Incubation Cell (EIC), Punjab Engineering College (Deemed to be University), Sector 12, Chandigarh 160012',
  dates: 'November 14–15, 2026',
  city: 'Chandigarh',
  emails: ['eicpec@pec.edu.in', 'esummitpr.pec@gmail.com'],
}
