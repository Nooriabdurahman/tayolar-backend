const { PrismaClient } = require('@prisma/client');
const { uploadToBlob } = require('../utils/blobUpload');


const prisma = new PrismaClient();

// Admin Card Management
const getAdminCards = async (req, res) => {
  try {
    const cards = await prisma.adminCard.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(cards);
  } catch (error) {
    console.error('Error fetching admin cards:', error);
    res.status(500).json({ message: 'Error fetching admin cards', error: error.message });
  }
};

const createAdminCard = async (req, res) => {
  try {
    const { cardNumber, cardHolder, expiry, cvc } = req.body;
    let imageUrl = null;

    // Upload image to Vercel Blob if provided
    if (req.file) {
      imageUrl = await uploadToBlob(req.file.originalname, req.file.buffer, 'admin-cards');
    }


    const card = await prisma.adminCard.create({
      data: {
        cardNumber,
        cardHolder,
        expiry,
        cvc: cvc || null,
        imageUrl,
      },
    });

    res.status(201).json(card);
  } catch (error) {
    console.error('Error creating admin card:', error);
    res.status(500).json({ message: 'Error creating admin card', error: error.message });
  }
};

const updateAdminCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { cardNumber, cardHolder, expiry, cvc } = req.body;
    let imageUrl = req.body.imageUrl; // Keep existing if no new file

    // Upload new image to Vercel Blob if provided
    if (req.file) {
      imageUrl = await uploadToBlob(req.file.originalname, req.file.buffer, 'admin-cards');
    }


    const card = await prisma.adminCard.update({
      where: { id },
      data: {
        cardNumber,
        cardHolder,
        expiry,
        cvc: cvc || undefined,
        imageUrl,
      },
    });

    res.json(card);
  } catch (error) {
    console.error('Error updating admin card:', error);
    res.status(500).json({ message: 'Error updating admin card', error: error.message });
  }
};

const deleteAdminCard = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.adminCard.delete({
      where: { id },
    });
    res.json({ message: 'Card deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin card:', error);
    res.status(500).json({ message: 'Error deleting admin card', error: error.message });
  }
};

const getActiveAdminCard = async (req, res) => {
  try {
    const card = await prisma.adminCard.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(card);
  } catch (error) {
    console.error('Error fetching active admin card:', error);
    res.status(500).json({ message: 'Error fetching active admin card', error: error.message });
  }
};

// Commission Settings Management
const getCommissionSettings = async (req, res) => {
  try {
    let settings = await prisma.commissionSettings.findFirst();
    if (!settings) {
      // Create default settings if none exist
      settings = await prisma.commissionSettings.create({
        data: { rate: 10.0 }
      });
    }
    res.json(settings);
  } catch (error) {
    console.error('Error fetching commission settings:', error);
    res.status(500).json({ message: 'Error fetching commission settings', error: error.message });
  }
};

const updateCommissionSettings = async (req, res) => {
  try {
    const { rate } = req.body;
    let settings = await prisma.commissionSettings.findFirst();

    if (settings) {
      settings = await prisma.commissionSettings.update({
        where: { id: settings.id },
        data: { rate },
      });
    } else {
      settings = await prisma.commissionSettings.create({
        data: { rate },
      });
    }

    res.json(settings);
  } catch (error) {
    console.error('Error updating commission settings:', error);
    res.status(500).json({ message: 'Error updating commission settings', error: error.message });
  }
};

// Commission Records
const getCommissions = async (req, res) => {
  try {
    const commissions = await prisma.commission.findMany({
      include: {
        order: {
          include: {
            client: {
              select: { id: true, name: true, email: true }
            },
            tailor: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(commissions);
  } catch (error) {
    console.error('Error fetching commissions:', error);
    res.status(500).json({ message: 'Error fetching commissions', error: error.message });
  }
};

const getCommissionStats = async (req, res) => {
  try {
    const totalCommissions = await prisma.commission.aggregate({
      _sum: { amount: true },
      _count: { id: true }
    });

    const paidCommissions = await prisma.commission.aggregate({
      where: { status: 'PAID' },
      _sum: { amount: true }
    });

    const settings = await prisma.commissionSettings.findFirst();

    res.json({
      totalAmount: totalCommissions._sum.amount || 0,
      totalCount: totalCommissions._count.id || 0,
      paidAmount: paidCommissions._sum.amount || 0,
      currentRate: settings?.rate || 10.0
    });
  } catch (error) {
    console.error('Error fetching commission stats:', error);
    res.status(500).json({ message: 'Error fetching commission stats', error: error.message });
  }
};

module.exports = {
  getAdminCards,
  createAdminCard,
  updateAdminCard,
  deleteAdminCard,
  getActiveAdminCard,
  getCommissionSettings,
  updateCommissionSettings,
  getCommissions,
  getCommissionStats,
};

