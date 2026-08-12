import { PrismaClient } from '@prisma/client';

export const seedMasterData = async (prisma: PrismaClient) => {
  console.log('📦 Seeding master data (Mitra, Services, Categories)...');

  // 1. Seed Mitra
  const sccic = await prisma.mitra.create({
    data: {
      nama_mitra: 'SCCIC',
      company_style: 'Smart City & Community Innovation Center',
      alamat: 'Institut Teknologi Bandung, Jl. Ganesa No.10, Bandung',
      contact_name: 'Daniel',
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
      contact_name: 'Daniel',
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

  // 3. Seed Sample Marketing Monitoring Projects (SRS Draft Data)
  console.log('📊 Seeding sample Marketing Monitoring data...');

  const catDigitalTwin = await prisma.category.findFirst({ where: { category_name: 'Urban Digital Twin' } });
  const catBuilding = await prisma.category.findFirst({ where: { category_name: 'Building Intelligence' } });
  const catAdvisory = await prisma.category.findFirst({ where: { category_name: 'Urban Advisory' } });

  // Project 1: Closing Deal (Urbansolv)
  await prisma.marketingMonitoring.create({
    data: {
      nama_proyek: 'Implementasi Urban Digital Twin Kawasan Industri Cikarang',
      mitra_id: urbansolv.id,
      service_id: serviceProduct.id,
      category_id: catDigitalTwin?.id || null,
      pic_id: 1,
      pic_name: 'Daniel',
      status: 'Closing',
      lead_source: 'Inbound Website',
      last_contact: new Date('2026-03-01'),
      tahun: 2026,
      deadline: new Date('2026-08-30'),
      keterangan_administratif: 'SPK telah ditandatangani kedua belah pihak',
      keterangan_crm: 'Klien sangat puas dengan demo 3D LiDAR scanning',
      transaksi: {
        create: {
          nilai_spk: 110000000,
          potential_revenue: 120000000,
          nilai_diterima: 110000000,
          cost_project: 45000000,
          net_profit: 65000000,
          tanggal_deal: new Date('2026-03-01'),
        },
      },
      catatan_monitoring: {
        create: [
          { user_id: 1, user_name: 'Daniel', note_text: 'Proyek dibuat dengan status awal: Inisiasi', note_type: 'STATUS_CHANGE' },
          { user_id: 1, user_name: 'Daniel', note_text: 'Presentasi proposal teknis diterima dengan baik', note_type: 'CRM_NOTE' },
          { user_id: 1, user_name: 'Daniel', note_text: 'Status diubah dari Penawaran menjadi Closing', note_type: 'STATUS_CHANGE' },
        ],
      },
    },
  });

  // Project 2: Kontrak (Urbansolv)
  await prisma.marketingMonitoring.create({
    data: {
      nama_proyek: 'Sistem Building Intelligence Gedung Perkantoran Sudirman',
      mitra_id: urbansolv.id,
      service_id: serviceProduct.id,
      category_id: catBuilding?.id || null,
      pic_id: 1,
      pic_name: 'Daniel',
      status: 'Kontrak',
      lead_source: 'Referral Partner',
      last_contact: new Date('2026-03-05'),
      tahun: 2026,
      deadline: new Date('2026-09-15'),
      keterangan_administratif: 'Draft kontrak SPK sedang direview legal tim',
      keterangan_crm: 'Klien meminta penyesuaian termin pembayaran 3 tahap',
      transaksi: {
        create: {
          nilai_spk: 42000000,
          potential_revenue: 50000000,
          nilai_diterima: 21000000,
          cost_project: 18000000,
          net_profit: 24000000,
          tanggal_deal: new Date('2026-03-05'),
        },
      },
      catatan_monitoring: {
        create: [
          { user_id: 1, user_name: 'Daniel', note_text: 'Status diubah dari Penawaran menjadi Kontrak', note_type: 'STATUS_CHANGE' },
        ],
      },
    },
  });

  // Project 3: Proposal Stage (SCCIC)
  await prisma.marketingMonitoring.create({
    data: {
      nama_proyek: 'Masterplan Urban Advisory Smart Mobility Jawa Barat',
      mitra_id: sccic.id,
      service_id: serviceSolution.id,
      category_id: catAdvisory?.id || null,
      pic_id: 1,
      pic_name: 'Daniel',
      status: 'Proposal',
      lead_source: 'Government Tender (B2G)',
      last_contact: new Date('2026-03-08'),
      tahun: 2026,
      deadline: new Date('2026-11-30'),
      keterangan_administratif: 'Dokumen prakualifikasi tender telah lengkap',
      keterangan_crm: 'Meeting penjajakan kebutuhan stakeholder dinas terkait',
      transaksi: {
        create: {
          nilai_spk: 318750000,
          potential_revenue: 350000000,
          nilai_diterima: 0,
          cost_project: 120000000,
          net_profit: 198750000,
        },
      },
      catatan_monitoring: {
        create: [
          { user_id: 1, user_name: 'Daniel', note_text: 'Penyusunan dokumen proposal teknis & TOR', note_type: 'STATUS_CHANGE' },
        ],
      },
    },
  });

  console.log('✅ Master data & sample sales tracking successfully seeded!');

  return {
    mitra: { sccic, urbansolv },
    services: { serviceProduct, serviceSolution, serviceInitiative },
  };
};
