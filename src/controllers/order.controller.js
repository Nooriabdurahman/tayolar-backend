const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createOrder = async (req, res) => {
    try {
        const { serviceId, tailorId, amount } = req.body;
        const clientId = req.user.userId;

        // Fetch current commission rate
        const settings = await prisma.commissionSettings.findFirst();
        const rate = settings ? settings.rate : 10.0;
        const commissionAmount = (amount * rate) / 100;

        const order = await prisma.order.create({
            data: {
                serviceId,
                clientId,
                tailorId,
                status: 'PENDING',
                commissionAmount,
            },
        });

        // Create commission record
        await prisma.commission.create({
            data: {
                rate,
                amount: commissionAmount,
                orderId: order.id,
                status: 'PENDING',
            }
        });

        res.status(201).json(order);
    } catch (error) {
        console.error('Create Order Error:', error);
        res.status(500).json({ message: 'Failed to create order', error: error.message });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.userId;
        const orders = await prisma.order.findMany({
            where: {
                OR: [
                    { clientId: userId },
                    { tailorId: userId }
                ]
            },
            include: {
                client: { select: { name: true, email: true } },
                tailor: { select: { name: true, email: true } },
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        console.error('Get Orders Error:', error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
};

module.exports = { createOrder, getUserOrders };
