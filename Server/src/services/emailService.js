import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error("Email service error:", error);
  } else {
    console.log("Email service ready");
  }
});

export const sendWelcomeEmail = async (userName, userEmail) => {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; }
            .welcome-message { font-size: 16px; margin-bottom: 20px; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 20px; }
            .button { display: inline-block; background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Course Master!</h1>
            </div>
            <div class="content">
              <p class="welcome-message">Hi <strong>${userName}</strong>,</p>
              <p>Thank you for registering with <strong>Course Master</strong>! We're excited to have you join our community of learners.</p>
              
              <p>You now have access to our complete library of courses designed to help you achieve your learning goals. Whether you're looking to:</p>
              <ul>
                <li>Learn new skills</li>
                <li>Advance your career</li>
                <li>Explore new interests</li>
              </ul>
              <p>We're here to support your journey every step of the way.</p>

              <a href="${process.env.CLIENT_URL}/dashboard" class="button">Start Learning Now</a>

              <p><strong>What's Next?</strong></p>
              <ol>
                <li>Complete your profile</li>
                <li>Browse our course catalog</li>
                <li>Enroll in your first course</li>
              </ol>

              <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
              <p>Happy learning!<br><strong>The Course Master Team</strong></p>
            </div>
            <div class="footer">
              <p>&copy; 2025 Course Master. All rights reserved.</p>
              <p>This email was sent because you registered on our platform.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Welcome to Course Master!",
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Welcome email sent to", userEmail);
    return info;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw error;
  }
};
