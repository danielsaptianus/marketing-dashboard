import { PrismaClient } from '@prisma/client';

export const seedMasterData = async (prisma: PrismaClient) => {
  console.log('📦 Seeding master data (Mitra, Services, Categories)...');

  // 1. Seed Mitra
  const sccic = await prisma.mitra.create({
    data: {
      nama_mitra: 'SCCIC',
      company_style: 'Smart City & Community Innovation Center',
      alamat: 'Institut Teknologi Bandung, Jl. Ganesa No.10, Bandung',
      contact_name: 'Contact SCCIC',
      contact_position: 'Business Representative',
      contact_phone: '022-2500935',
      contact_email: 'contact@sccic.id',
    },
  });

  const urbansolv = await prisma.mitra.create({
    data: {
      nama_mitra: 'Urbansolv',
      company_style: 'Technology & Urban Solutions',
      alamat: 'ITB Innovation Park, Gedung 01, Lantai 09',
      contact_name: 'Valdi Firstianto',
      contact_position: 'Tech Lead / Management',
      contact_phone: '6282230668151',
      contact_email: 'contact@urbansolv.co.id',
    },
  });

  // 2. Seed Services & Categories based on SRS Halaman 9, 10, 19
  // Service 1: Product
  const serviceProduct = await prisma.service.create({
    data: {
      service_name: 'Product',
      description: 'Layanan berbasis produk software dan platform',
      categories: {
        create: [
          { category_name: 'Urban Digital Twin' },
          { category_name: 'Building Intelligence' },
          { category_name: 'Asset Management' },
          { category_name: 'Market Intelligence' },
        ],
      },
    },
  });

  // Service 2: Solution
  const serviceSolution = await prisma.service.create({
    data: {
      service_name: 'Solution',
      description: 'Layanan solusi pengembangan dan konsultasi',
      categories: {
        create: [
          { category_name: 'Urban Advisory' },
          { category_name: 'Urban IT Development' },
        ],
      },
    },
  });

  // Service 3: Initiative
  const serviceInitiative = await prisma.service.create({
    data: {
      service_name: 'Initiative',
      description: 'Inisiatif riset, akselerasi, dan pengembangan teknologi baru',
      categories: {
        create: [
          { category_name: 'Urban X Clerate' },
          { category_name: 'Urban R&D' },
        ],
      },
    },
  });

  console.log('✅ Master data (Mitra, Services, Categories) successfully seeded!');

  return {
    mitra: { sccic, urbansolv },
    services: { serviceProduct, serviceSolution, serviceInitiative },
  };
};
