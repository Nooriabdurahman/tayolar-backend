const nodemailer = require('nodemailer');

let transporter;

const getTransporter = async () => {
    if (transporter) return transporter;

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        console.log('Using configured SMTP credentials:', process.env.EMAIL_USER);
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    } else {
        console.warn('\n\n[WARNING] Email credentials not set. Creating a test account via Ethereal...');
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
        console.log(`Test account created! View sent emails at: https://ethereal.email (User: ${testAccount.user})\n\n`);
    }
    return transporter;
};

const sendVerificationEmail = async (email, code) => {
    try {
        const mailTransporter = await getTransporter();
        const mailOptions = {
            from: '"TailorHub" <' + (process.env.EMAIL_USER || 'noreply@tayolar.com') + '>',
            to: email,
            subject: 'Email Verification - TailorHub',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <h2 style="color: #4f46e5; text-align: center;">Welcome to TailorHub!</h2>
                    <p>Thank you for signing up. Please verify your email address by using the code below:</p>
                    <div style="background-color: #f8fafc; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e293b; border-radius: 8px; margin: 20px 0;">
                        ${code}
                    </div>
                    <p>If you didn't create an account, you can safely ignore this email.</p>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #64748b; text-align: center;">&copy; 2026 TailorHub. All rights reserved.</p>
                </div>
            `
        };

        const info = await mailTransporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${email}`);
        
        if (nodemailer.getTestMessageUrl(info)) {
            console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        }
        
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

module.exports = { sendVerificationEmail };
