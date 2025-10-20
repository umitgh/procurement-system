// prisma/seed.ts
// Seed initial data for the Procurement System

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Create initial admin user (CTO/SUPER_ADMIN)
  console.log('Creating admin user...');
  const adminPasswordHash = await bcrypt.hash('Admin123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@company.com' },
    update: {},
    create: {
      email: 'admin@company.com',
      name: 'System Administrator',
      passwordHash: adminPasswordHash,
      role: 'SUPER_ADMIN',
      approvalLimit: 999999999, // Unlimited
      isActive: true,
      language: 'he',
    },
  });

  console.log(`✓ Admin user created: ${admin.email}`);

  // 2. Create character lists (Service/Item/Manpower)
  console.log('Creating character lists...');

  // Character1: Service/Item/Manpower
  const char1Values = [
    { value: 'שירות', valueEn: 'Service', order: 1 },
    { value: 'פריט', valueEn: 'Item', order: 2 },
    { value: 'כוח אדם', valueEn: 'Manpower', order: 3 },
  ];

  for (const char of char1Values) {
    await prisma.character.upsert({
      where: {
        type_value: {
          type: 'character1',
          value: char.value,
        },
      },
      update: {},
      create: {
        type: 'character1',
        value: char.value,
        valueEn: char.valueEn,
        order: char.order,
        isActive: true,
      },
    });
  }

  // Character2: Hardware/Software/Cloud Service/Consulting/Training
  const char2Values = [
    { value: 'חומרה', valueEn: 'Hardware', order: 1 },
    { value: 'תוכנה', valueEn: 'Software', order: 2 },
    { value: 'שירותי ענן', valueEn: 'Cloud Service', order: 3 },
    { value: 'ייעוץ', valueEn: 'Consulting', order: 4 },
    { value: 'הדרכה', valueEn: 'Training', order: 5 },
  ];

  for (const char of char2Values) {
    await prisma.character.upsert({
      where: {
        type_value: {
          type: 'character2',
          value: char.value,
        },
      },
      update: {},
      create: {
        type: 'character2',
        value: char.value,
        valueEn: char.valueEn,
        order: char.order,
        isActive: true,
      },
    });
  }

  // Character3: Critical/Standard/Low Priority
  const char3Values = [
    { value: 'קריטי', valueEn: 'Critical', order: 1 },
    { value: 'סטנדרטי', valueEn: 'Standard', order: 2 },
    { value: 'עדיפות נמוכה', valueEn: 'Low Priority', order: 3 },
  ];

  for (const char of char3Values) {
    await prisma.character.upsert({
      where: {
        type_value: {
          type: 'character3',
          value: char.value,
        },
      },
      update: {},
      create: {
        type: 'character3',
        value: char.value,
        valueEn: char.valueEn,
        order: char.order,
        isActive: true,
      },
    });
  }

  console.log('✓ Character lists created');

  // 3. Create companies
  console.log('Creating companies...');

  const companies = [
    { name: 'חברה א', nameEn: 'Company A', taxId: '123456789' },
    { name: 'חברה ב', nameEn: 'Company B', taxId: '987654321' },
    { name: 'חברה ג', nameEn: 'Company C', taxId: '456789123' },
  ];

  for (const company of companies) {
    const existingCompany = await prisma.company.findFirst({
      where: { name: company.name },
    });

    if (!existingCompany) {
      await prisma.company.create({
        data: {
          name: company.name,
          nameEn: company.nameEn,
          taxId: company.taxId,
          isActive: true,
        },
      });
    }
  }

  console.log('✓ Companies created');

  // 4. Create sample suppliers
  console.log('Creating sample suppliers...');

  const suppliers = [
    {
      name: 'מיקרוסופט ישראל',
      nameEn: 'Microsoft Israel',
      email: 'orders@microsoft.co.il',
      phone: '03-1234567',
      contactPerson: 'משה כהן',
      taxId: '111222333',
      address: 'רח\' הארבעה 7, תל אביב',
    },
    {
      name: 'Dell ישראל',
      nameEn: 'Dell Israel',
      email: 'sales@dell.co.il',
      phone: '03-7654321',
      contactPerson: 'שרה לוי',
      taxId: '444555666',
      address: 'רח\' העצמאות 12, הרצליה',
    },
    {
      name: 'AWS',
      nameEn: 'Amazon Web Services',
      email: 'billing@aws.amazon.com',
      phone: '+1-206-266-1000',
      contactPerson: 'Support Team',
      taxId: 'INT123456',
      address: 'Seattle, WA, USA',
    },
  ];

  for (const supplier of suppliers) {
    const existingSupplier = await prisma.supplier.findFirst({
      where: { email: supplier.email },
    });

    if (!existingSupplier) {
      await prisma.supplier.create({
        data: supplier,
      });
    }
  }

  console.log('✓ Sample suppliers created');

  // 5. Create sample items
  console.log('Creating sample items...');

  const serviceChar = await prisma.character.findFirst({
    where: { type: 'character1', value: 'שירות' },
  });

  const softwareChar = await prisma.character.findFirst({
    where: { type: 'character2', value: 'תוכנה' },
  });

  const standardChar = await prisma.character.findFirst({
    where: { type: 'character3', value: 'סטנדרטי' },
  });

  const microsoftSupplier = await prisma.supplier.findFirst({
    where: { nameEn: 'Microsoft Israel' },
  });

  if (serviceChar && softwareChar && standardChar && microsoftSupplier) {
    await prisma.item.upsert({
      where: { sku: '2025-SRV-00001' },
      update: {},
      create: {
        sku: '2025-SRV-00001',
        name: 'רישיון Office 365',
        nameEn: 'Office 365 License',
        description: 'רישיון חודשי ל-Office 365 Business Standard',
        descriptionEn: 'Monthly license for Office 365 Business Standard',
        character1Id: serviceChar.id,
        character2Id: softwareChar.id,
        character3Id: standardChar.id,
        suggestedPrice: 50,
        isOneTimePurchase: false,
        validFrom: new Date('2025-01-01'),
        validTo: new Date('2025-12-31'),
        supplierId: microsoftSupplier.id,
        isActive: true,
      },
    });
  }

  console.log('✓ Sample items created');

  // 6. Create system config defaults
  console.log('Creating system configuration...');

  const configs = [
    {
      key: 'alert_supplier_limit',
      value: '100000',
      description: 'Supplier spending alert threshold (NIS)',
    },
    {
      key: 'default_language',
      value: 'he',
      description: 'Default system language (he/en)',
    },
    {
      key: 'po_number_format',
      value: 'PO-{DATE}-{SEQ}',
      description: 'Purchase order number format',
    },
    {
      key: 'sku_format',
      value: '{YEAR}-{CAT}-{SEQ}',
      description: 'Item SKU format',
    },
  ];

  for (const config of configs) {
    await prisma.systemConfig.upsert({
      where: { key: config.key },
      update: {},
      create: config,
    });
  }

  console.log('✓ System configuration created');

  console.log('\n✅ Database seed completed successfully!');
  console.log('\n📝 Default credentials:');
  console.log('   Email: admin@company.com');
  console.log('   Password: Admin123!');
  console.log('\n⚠️  Please change the admin password after first login!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
