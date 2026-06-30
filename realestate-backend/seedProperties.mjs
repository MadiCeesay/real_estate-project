import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });

const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) { console.error('❌ No MONGODB_URI in .env'); process.exit(1); }

const propertySchema = new mongoose.Schema({
  title: String, description: String, price: Number,
  type: String, category: String,
  bedrooms: Number, bathrooms: Number, area: Number,
  address: { street: String, city: String, state: String, country: String },
  location: { type: { type: String, default: 'Point' }, coordinates: [Number] },
  images: [{ url: String, publicId: String }],
  amenities: [String],
  agent: mongoose.Schema.Types.ObjectId,
  status: { type: String, default: 'active' },
  isFeatured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  firstName: String, lastName: String, email: String, role: String,
});

const Property = mongoose.model('Property', propertySchema);
const User = mongoose.model('User', userSchema);

const seed = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  await Property.deleteMany({});
  console.log('🗑️  Cleared existing properties');

  const agent = await User.findOne({ role: { $in: ['admin', 'agent'] } });
  if (!agent) { console.error('❌ No admin/agent user found. Run createadmin.mjs first.'); process.exit(1); }
  console.log(`👤 Agent: ${agent.firstName} ${agent.lastName}`);

  const agentId = agent._id;

  const properties = [
    {
      title: 'Luxury 4 Bedroom Villa in Kololi',
      description: 'Stunning modern villa in the heart of Kololi with spacious living areas, private garden, and high-end finishes. Close to Senegambia Strip, restaurants, and beaches.',
      price: 8500000, type: 'sale', category: 'villa',
      bedrooms: 4, bathrooms: 3, area: 320,
      address: { street: 'Senegambia Road', city: 'Kololi', state: 'West Coast Region', country: 'Gambia' },
      location: { type: 'Point', coordinates: [-16.7089, 13.4549] },
      images: [
        { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop', publicId: 'kololi-villa-1' },
        { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop', publicId: 'kololi-villa-2' },
      ],
      amenities: ['parking', 'pool', 'garden', 'security', 'airConditioning'],
      agent: agentId, status: 'active', isFeatured: true,
    },
    {
      title: 'Modern 3 Bedroom Apartment in Banjul',
      description: 'Contemporary apartment in the capital with sea views, modern kitchen, and secure parking. Minutes from government offices and the ferry terminal.',
      price: 4200000, type: 'sale', category: 'apartment',
      bedrooms: 3, bathrooms: 2, area: 180,
      address: { street: 'Independence Drive', city: 'Banjul', state: 'Greater Banjul', country: 'Gambia' },
      location: { type: 'Point', coordinates: [-16.5774, 13.4549] },
      images: [
        { url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop', publicId: 'banjul-apt-1' },
        { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop', publicId: 'banjul-apt-2' },
      ],
      amenities: ['parking', 'security', 'internet', 'airConditioning'],
      agent: agentId, status: 'active', isFeatured: true,
    },
    {
      title: '2 Bedroom House for Rent in Serrekunda',
      description: 'Well-maintained family home in a quiet Serrekunda neighbourhood. Spacious compound, secure gate, borehole water. Close to markets and schools.',
      price: 15000, type: 'rent', category: 'house',
      bedrooms: 2, bathrooms: 1, area: 120,
      address: { street: 'Kairaba Avenue', city: 'Serrekunda', state: 'West Coast Region', country: 'Gambia' },
      location: { type: 'Point', coordinates: [-16.6783, 13.4349] },
      images: [
        { url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&auto=format&fit=crop', publicId: 'serrekunda-house-1' },
        { url: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&auto=format&fit=crop', publicId: 'serrekunda-house-2' },
      ],
      amenities: ['garden', 'security'],
      agent: agentId, status: 'active', isFeatured: true,
    },
    {
      title: 'Beachfront 5 Bedroom Villa in Fajara',
      description: 'Exclusive beachfront property in Fajara with direct ocean access, swimming pool, solar power, and landscaped gardens. Fully furnished and move-in ready.',
      price: 18000000, type: 'sale', category: 'villa',
      bedrooms: 5, bathrooms: 4, area: 500,
      address: { street: 'Atlantic Road', city: 'Fajara', state: 'West Coast Region', country: 'Gambia' },
      location: { type: 'Point', coordinates: [-16.7200, 13.4700] },
      images: [
        { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop', publicId: 'fajara-villa-1' },
        { url: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&auto=format&fit=crop', publicId: 'fajara-villa-2' },
      ],
      amenities: ['pool', 'garden', 'parking', 'security', 'airConditioning', 'furnished', 'internet'],
      agent: agentId, status: 'active', isFeatured: true,
    },
    {
      title: 'Commercial Office Space in Banjul CBD',
      description: 'Prime commercial space in Banjul Central Business District. Open-plan layout, fibre internet, air conditioning, backup generator, and 24-hour access.',
      price: 25000, type: 'rent', category: 'commercial',
      bedrooms: 0, bathrooms: 2, area: 200,
      address: { street: 'Ecowas Avenue', city: 'Banjul', state: 'Greater Banjul', country: 'Gambia' },
      location: { type: 'Point', coordinates: [-16.5700, 13.4530] },
      images: [
        { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop', publicId: 'banjul-office-1' },
        { url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&auto=format&fit=crop', publicId: 'banjul-office-2' },
      ],
      amenities: ['parking', 'internet', 'airConditioning', 'security', 'elevator'],
      agent: agentId, status: 'active', isFeatured: false,
    },
    {
      title: '1 Bedroom Apartment for Rent in Bakau',
      description: 'Compact affordable apartment in Bakau ideal for young professionals. Close to Atlantic Road, beach, supermarkets, and restaurants.',
      price: 8000, type: 'rent', category: 'apartment',
      bedrooms: 1, bathrooms: 1, area: 65,
      address: { street: 'Old Cape Road', city: 'Bakau', state: 'West Coast Region', country: 'Gambia' },
      location: { type: 'Point', coordinates: [-16.6900, 13.4750] },
      images: [
        { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop', publicId: 'bakau-apt-1' },
        { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop', publicId: 'bakau-apt-2' },
      ],
      amenities: ['internet', 'airConditioning'],
      agent: agentId, status: 'active', isFeatured: false,
    },
    {
      title: 'Residential Land Plot in Brusubi',
      description: 'Prime residential land in fast-developing Brusubi. Fully documented with government papers and clear title. Electricity and water on street.',
      price: 1200000, type: 'sale', category: 'land',
      bedrooms: 0, bathrooms: 0, area: 450,
      address: { street: 'Brusubi Turntable Road', city: 'Brusubi', state: 'West Coast Region', country: 'Gambia' },
      location: { type: 'Point', coordinates: [-16.7800, 13.4100] },
      images: [
        { url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop', publicId: 'brusubi-land-1' },
        { url: 'https://images.unsplash.com/photo-1464082354059-27db6ce50048?w=800&auto=format&fit=crop', publicId: 'brusubi-land-2' },
      ],
      amenities: [],
      agent: agentId, status: 'active', isFeatured: false,
    },
    {
      title: 'Studio Apartment for Rent in Kololi',
      description: 'Modern fully furnished studio in the tourist hub of Kololi. Walking distance to Senegambia Strip, restaurants, and nightlife. Utilities included.',
      price: 6000, type: 'rent', category: 'studio',
      bedrooms: 0, bathrooms: 1, area: 40,
      address: { street: 'Senegambia Strip', city: 'Kololi', state: 'West Coast Region', country: 'Gambia' },
      location: { type: 'Point', coordinates: [-16.7100, 13.4520] },
      images: [
        { url: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&auto=format&fit=crop', publicId: 'kololi-studio-1' },
        { url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop', publicId: 'kololi-studio-2' },
      ],
      amenities: ['furnished', 'internet', 'airConditioning'],
      agent: agentId, status: 'active', isFeatured: false,
    },
  ];

  const inserted = await Property.insertMany(properties);
  console.log(`\n🏠 Seeded ${inserted.length} properties:`);
  inserted.forEach(p => console.log(`   ✓ ${p.title}`));

  await mongoose.disconnect();
  console.log('\n✅ Done! Restart your backend then refresh the frontend.');
};

seed().catch(err => { console.error('❌ Error:', err.message); process.exit(1); });