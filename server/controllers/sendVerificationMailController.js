const nodemailer = require("nodemailer");


//send verification email
exports.sendVerificationEmail = async (email, verificationCode) => {
    console.log(process.env.EMAIL, process.env.EMAIL_PASSWORD);
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Your Email Verification Code",
      html: `
          <h1>Email Verification</h1>
          <p>Your verification code is: <b>${verificationCode}</b></p>
          <p>Please enter this code to verify your email address.</p>
        `,
    };
  
    const emailSent = await transporter.sendMail(mailOptions);
    return emailSent;
  };
  