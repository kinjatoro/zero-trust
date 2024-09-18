// nodemailer.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendMail = async (email, code) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Código de verificación - Banco Galicia',
            text: `Tu código de verificación es: ${code}`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.response}`);
    } catch (error) {
        console.log(error);
    }
};
