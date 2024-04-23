const User = require("../models/User");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail", // e.g. 'Gmail'
  auth: {
    user: "bbtransactionmanager@gmail.com",
    pass: "xhzv rmjc gugh bodu",
  },
});

// app.post("/signup",
module.exports.SignUp = async (req, res) => {
  try {
    let { username, email, password, buss_name, mob, trans_pass } = req.body;
    console.log(req.body);
    const existingUser = await User.findOne({
      $or: [{ username }, { email }, { mob }],
    });
    if (existingUser) {
      return res.status(409).json({ error: "Username already taken" });
    }
    const salt = await bcrypt.genSalt(10);
    let deleteTrans = await bcrypt.hash(
      trans_pass?.trim()?.replace(/\s+/g, " "),
      salt
    );
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      deleteTrans,
      email,
      username: username?.trim()?.replace(/\s+/g, " "),
      buss_name,
      mob,
      hashedPassword,
    });
    console.log(newUser);
    const newuser = await newUser.save();

    const mailOptions = {
      from: "bbtransactionmanager@gmail.com",
      to: email,
      subject: "Welcome Mail",
      html: `<html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <h2>Hello ${username},</h2>
        <p>
          Welcome to <strong>B2B Transaction Manager</strong>! We're excited to have you on board.
        </p>
        <p>
          In our platform, you can manage all your business and stock transactions efficiently.
          Whether you're tracking inventory, handling payments, or managing vendors, our tools make it easy and seamless.
        </p>
        <p>
          With <strong>B2B Transaction Manager</strong>, you can also generate detailed reports to analyze your business performance and make informed decisions.
          Our user-friendly interface ensures you can get started quickly and navigate the platform with ease.
        </p>
        <p>
          If you have any questions or need assistance, don't hesitate to reach out to our support team.
          We're here to help you succeed and make the most out of our platform.
        </p>
        <p>
          Once again, welcome to the <strong>B2B Transaction Manager</strong> family! We're thrilled to be part of your business journey.
        </p>
        <p>This is an auto generated email. Please do not reply to this email.</p>
        <p>Best regards,</p>
        <p><strong>B2B Transaction Manager</strong></p>
      </body>
    </html>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Email error:", err);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(400).json({
      message: error.message,
    });
  }
};

// app.post("/login",
module.exports.Login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    console.log(user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.hashedPassword
    );
    console.log(isPasswordCorrect);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const mailOptions = {
      from: "bbtransactionmanager@gmail.com",
      to: user.email,
      subject: "Login Alert",
      html: `
      <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <h2>Hello ${username},</h2>
        <p>
          This is a notice to inform you that a login to your account was detected on <strong>${new Date().toLocaleString()}</strong>.
        </p>
        <p>
          If you initiated this login, no further action is necessary. If you did not authorize this login, please contact our support team or change your password as soon as possible.
        </p>
        <p>This is an auto generated email. Please do not reply to this email.</p>
        <p>Thank you,</p>
        <p>Best regards,</p>
        <p><strong>B2B TRANSACTION MANAGER</strong></p>
      </body>
    </html>
    
  `,
      headers: {
        "X-Priority": "1", // Priority level 1 (High) marks the email as important
      },
    };

    // transporter.sendMail(mailOptions, (err, info) => {
    //   if (err) {
    //     console.error("Email error:", err);
    //   } else {
    //     console.log("Email sent:", info.response);
    //   }
    // });
    return res.status(200).json({ message: "Login successful", user: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.reset = async function (req, res) {
  try {
    const { username, email, mob, password } = req.body;
    console.log(req.body);
    const user = await User.findOne({ username, email, mob });
    if (!user) {
      return res
        .status(404)
        .json({ error: "No user found with the provided details." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.hashedPassword = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res
      .status(500)
      .json({ error: "An error occurred while resetting the password." });
  }
};

module.exports.changePassword = async function (req, res) {
  try {
    const { username, email, mob, currPassword, NewPassword } = req.body;
    console.log(req.body);
    const user = await User.findOne({ username, email, mob });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    const isMatch = await bcrypt.compare(currPassword, user.hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect current password." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(NewPassword, salt);
    user.hashedPassword = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res
      .status(500)
      .json({ error: "An error occurred while changing the password." });
  }
};
