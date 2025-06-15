import { inngest } from "../client"
import { User } from "../../models/user";
import { NonRetriableError } from "inngest";
import { sendEmail } from "../../utils/mailer";

export const onUserSignup = inngest.createFunction(
    {id: "onUserSignup", retries: 2},
    {event: "user/signup"},
    async ({event, step}) => {
        try {
            const {email}= event.data;
            const user = await step.run("get user email", async () => {
                const UserObject = User.findOne({email})
                if(!UserObject) {
                    throw new NonRetriableError("User not found");
                }

                return UserObject;
            })


            await step.run("send welcome email", async () => {
                const subject = "Welcome to Inngest Ticketing System";
                const text = `Hello 
                \n\n
                Thank you for signing up for our ticketing system! We're excited to have you on board.\n\nBest regards,\nThe Inngest Team`;
                
                await sendEmail(user.email, subject, text);
                // Assuming sendEmail is a function that sends an email
                await sendEmail(user.email, subject, text);
            })

            return { success: true, message: "Welcome email sent successfully." };
        }
            catch (error) {
                console.error("Error in onUserSignup function:", error.message);
                return { success: false, message: error.message };

            }       
})
