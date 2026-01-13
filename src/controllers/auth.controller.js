const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { sendVerificationEmail } = require('../utils/mailer');

const prisma = new PrismaClient();

const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const signup = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = generateVerificationCode();

        // SEND REAL EMAIL
        await sendVerificationEmail(email, verificationCode);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'CLIENT',
                isVerified: false,
                verificationCode
            },
        });

        if (role === 'TAILOR') {
            await prisma.profile.create({
                data: {
                    userId: user.id
                }
            });
        }

        res.status(201).json({ message: 'Verification code sent to email', email: user.email });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const verifyEmail = async (req, res) => {
    const { email, code } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'User is already verified' });
        }

        if (user.verificationCode !== code) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                verificationCode: null
            }
        });

        const token = jwt.sign({ userId: updatedUser.id, role: updatedUser.role }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        res.status(200).json({
            message: 'Email verified successfully',
            token,
            user: { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role }
        });

    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Hardcoded Admin Login
        if (email === 'admin@gmail.com') {
            if (password === 'admin') {
                const token = jwt.sign({ userId: 'admin-id', role: 'ADMIN' }, process.env.JWT_SECRET, {
                    expiresIn: '7d',
                });
                return res.status(200).json({
                    token,
                    user: {
                        id: 'admin-id',
                        name: 'System Admin',
                        email: 'admin@gmail.com',
                        role: 'ADMIN',
                        isVerified: true
                    }
                });
            } else {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email address first', email: user.email });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Prevent regular users from logging in if they somehow have ADMIN role but aren't the hardcoded admin
        // This effectively restricts ADMIN access to ONLY admin@gmail.com
        const role = user.role === 'ADMIN' ? 'CLIENT' : user.role;

        const token = jwt.sign({ userId: user.id, role }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email, role } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const resendCode = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'User is already verified' });
        }

        const verificationCode = generateVerificationCode();
        await prisma.user.update({
            where: { id: user.id },
            data: { verificationCode }
        });

        await sendVerificationEmail(email, verificationCode);
        res.status(200).json({ message: 'Verification code resent successfully' });
    } catch (error) {
        console.error('Resend code error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { signup, login, verifyEmail, resendCode };
