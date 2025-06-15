import nodemailer from 'nodemailer';


export const sendEmail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_SMTP_HOST,
            port: MAILTRAP_SMTP_PORT,
            secure: false,
            auth: {
                user: MAILTRAP_SMTP_USER,
                pass: MAILTRAP_SMTP_PASSWORD,
            },
        });

            const info = await transporter.sendMail({
                from: '"Inngest TMS',
                to,
                subject,
                text
            });

            console.log("Message sent:", info.messageId);
            return info;
    } catch (error) {
        console.error("Error sending email:", error.message);
        throw error;
    }
    
};