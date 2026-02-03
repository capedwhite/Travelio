import { User } from "../Model/userModel.js";
import { generateToken } from "../Utills/jwt.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const validatePassword = (password) => {
  const errors = [];
  if (password.length < 6)
    errors.push("Password must be at least 6 characters");
  if (!/[0-9]/.test(password)) errors.push("Must contain number");
  return errors;
};

const login = async (req, res) => {
  try {
    const body = req.body;
    if (body.username === null) {
      return res
        .status(401)
        .send({ message: "cannot leave email field empty" });
    }
    if (body.password === null) {
      return res
        .status(401)
        .send({ message: "cannot leave password field empty" });
    }
    const user = await User.findOne({
      where: { username: body.username },
    });
    if (!user) {
      return res.status(500).send({ message: "Invalid credentials" });
    }
    if (user) {
      const isMatch = await bcrypt.compare(body.password, user.password);
      if (!isMatch) {
        return res.status(500).send({ message: "Invalid credentials" });
      }
      const token = generateToken(user);
      if (user.role === "Admin") {
        return res.status(200).send({
          token,
          data: user,
          message: "Admin logged in successfully",
        });
      }

      res.status(200).send({
        token,
        data: user,
        message: "User logged in successfully",
      });
    }
  } catch (e) {
    console.log(e.message);
    console.log(e);
    res.status(500).send({ message: e.message });
  }
};

const signUp = async (req, res) => {
  try {
    console.log("asign in api hit");
    const body = req.body;
    console.log(body);
    if (!body.email || !body.password || !body.username || !body.number) {
      return res.status(401).send({ message: "Cannot leave fields empty" });
    }
    const userExists = await User.findOne({ where: { email: body.email } });
    if (userExists) {
      return res.status(401).send({ message: "user already exists in email" });
    }
    const usernameExists = await User.findOne({
      where: { username: body.username },
    });
    if (usernameExists) {
      return res.status(401).send({ message: "Username already in-use" });
    }
    const passwordErrors = validatePassword(body.password);
    if (passwordErrors.length > 0) {
      return res.status(401).send({ message: "password requirements not met" });
    }
    const hashedPassword = await bcrypt.hash(body.password, 10);
    console.log(hashedPassword);
    const createUser = await User.create({
      username: body.username,
      email: body.email,
      password: hashedPassword,
      number: body.number,
    });
    res
      .status(200)
      .send({
        token: generateToken(createUser),
        data: createUser,
        message: "Logged in sucessfully",
      });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: e.message });
  }
};
export const googleCallback = (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(400)
        .json({ message: "No user information found from Google" });
    }
    const token = generateToken(req.user);

    res.redirect(
      `http://localhost:5173/auth/google/callback/google-success?token=${token}`,
    );
  } catch (error) {
    console.error("Error in Google callback:", error);

    res.redirect("http://localhost:5173/google-error");
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {

      return res
        .status(200)
        .send({
          message:
            "If an account with that email exists, a reset link has been sent.",
        });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    // Save token to user
    await user.update({
      resetToken,
      resetTokenExpiry,
    });

    // Create reset URL
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    // Send email
    const mailOptions = {
      to: email,
      subject: "Travelio - Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #3ab19d; margin: 0;">Travelio</h1>
            <p style="color: #666; margin-top: 5px;">Password Reset Request</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; border-left: 4px solid #3ab19d;">
            <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
              Hello,
            </p>
            <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
              We received a request to reset your password. Click the button below to create a new password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: #3ab19d; color: white; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-bottom: 10px;">
              This link will expire in 1 hour.
            </p>
            <p style="color: #666; font-size: 14px;">
              If you didn't request this, please ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>© 2026 Travelio. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .send({
        message:
          "If an account with that email exists, a reset link has been sent.",
      });
  } catch (e) {
    console.log("Forgot password error:", e);
    res
      .status(500)
      .send({ message: "Failed to send reset email. Please try again." });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res
        .status(400)
        .send({ message: "Token and password are required" });
    }


    const user = await User.findOne({
      where: {
        resetToken: token,
      },
    });

    if (!user) {
      return res
        .status(400)
        .send({ message: "Invalid or expired reset token" });
    }


    if (new Date() > new Date(user.resetTokenExpiry)) {
      return res.status(400).send({ message: "Reset token has expired" });
    }


    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return res.status(400).send({ message: passwordErrors.join(", ") });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await user.update({
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    });

    res.status(200).send({ message: "Password reset successful" });
  } catch (e) {
    console.log("Reset password error:", e);
    res
      .status(500)
      .send({ message: "Failed to reset password. Please try again." });
  }
};

export { login, signUp, forgotPassword, resetPassword };
