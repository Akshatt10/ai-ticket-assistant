import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { sendEmail } from '../utils/mailer.js';
import { inngest } from '../inngest/client.js';


export const signup = async (req, res) => {
    const { email, password, skills=[] } = req.body;

    try {

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            password: hashedPassword,
            skills
        });

        // Trigger Inngest event for user signup
        await inngest.send({
            name: 'user/signup',
            data: {
                email
            }
        });

        const token =jwt.sign(
                    {
                        _id: user._id, 
                        role: user.role,
                    },
                    process.env.JWT_SECRET