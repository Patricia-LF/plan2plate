// emailService.js with nodemailer
import * as dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import { recipeEmailTemplate } from "./emailTemplate.js";  // Import template

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

//Verify SMTP connection on startup (development/debugging only) 
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP verify failed:", error);
  } else {
    console.log("SMTP server is ready to take our emails");
  }
});

export async function sendRecipeEmail(recipientEmail, recipe) {
  try {
    const mailOptions = {
      from: `Plan2Plate 🍽️ <${process.env.EMAIL_USER}>`, //change sender name
      to: recipientEmail,
      subject: `Recipe: ${recipe.title}`,
      html: recipeEmailTemplate(recipe)  // Use template
    };
    
    await transporter.sendMail(mailOptions);
    return { success: true };
    
  } catch (error) {
    console.error('Email error:', error);
    const err = new Error('Failed to send email');
    err.status = 500;
    throw err;
  }
}