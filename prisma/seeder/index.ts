import * as dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { seedMasterData } from './data/master.seed';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting Marketing Monitoring database seeding...\n');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.catatanMonitoring.deleteMany();
  await prisma.transaksi.deleteMany();
  await prisma.marketingMonitoring.deleteMany();
  await prisma.category.deleteMany();
  await prisma.service.deleteMany();
  await prisma.mitra.deleteMany();

  // Run Master Data Seeder
  await seedMasterData(prisma);

  // Summary
  console.log('\n✨ Database seeding completed!\n');
  console.log('📊 Summary:');
  console.log(`   - Mitra: ${await prisma.mitra.count()}`);
  console.log(`   - Services: ${await prisma.service.count()}`);
  console.log(`   - Categories: ${await prisma.category.count()}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
