const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
    console.log('Seeding database...');

    // 1. Create Admin User
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@tayolar.com' },
        update: {},
        create: {
            id: 'ADMIN_USER',
            email: 'admin@tayolar.com',
            password: hashedPassword,
            name: 'Tayolar Admin',
            role: 'ADMIN',
            isVerified: true,
            verificationCode: 'VERIFIED'
        },
    });
    console.log('Admin user created:', admin.email);

    // 2. Create Commission Settings
    const settings = await prisma.commissionSettings.upsert({
        where: { id: 'DEFAULT_SETTINGS' },
        update: {},
        create: {
            id: 'DEFAULT_SETTINGS',
            rate: 10.0,
        },
    });
    console.log('Commission settings created');

    // 3. Create initial Admin Card
    const card = await prisma.adminCard.create({
        data: {
            cardNumber: '4242 4242 4242 4242',
            cardHolder: 'Tayolar Platform',
            expiry: '12/28',
            cvc: '123',
            isActive: true,
            imageUrl: 'https://images.unsplash.com/photo-1540339832862-47455f13ec4e?auto=format&fit=crop&q=80&w=800'
        }
    });
    console.log('Admin card created:', card.cardNumber);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
