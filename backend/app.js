require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
//const User = require("./userdetails");
const Remark = require("./remarks"); 
const Feedback = require("./feedback");
//const GoogleStrategy = require('passport-google-oauth2').Strategy;
const Event = require('./event');
const User=require('./user');
// const session = require("express-session");
// const passport = require("passport");
// require("./config/passport");

const app = express();
const mongoUrl = "mongodb+srv://npallapo:gC580rwLVY55JlWR@cluster0.gumrtg8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const port = process.env.PORT || 5001;

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Database connected");
    })
    .catch((e) => {
        console.error("Database connection error: ", e);
    });

app.use(express.json());
app.use(cors());
// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true
// }));
// app.use(passport.initialize());
// app.use(passport.session());

app.get("/", (req, res) => {
    res.send({ status: "Started" });
});

// Update your registration endpoint
app.post('/register', async (req, res) => {
    const { name, email, phone, address, password, confirm_password } = req.body;

    if (!name || !email || !phone || !address || !password || !confirm_password) {
        return res.send({ status: "error", data: "All fields are required" });
    }

    if (password !== confirm_password) {
        return res.send({ status: "error", data: "Passwords do not match" });
    }

    try {
        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.send({ status: "error", data: "User already exists!" });
        }

        const OTP = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
        const expiryTime = new Date();
        expiryTime.setMinutes(expiryTime.getMinutes() + 15); // OTP expiry time: 15 minutes

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            phone,
            address,
            password: hashedPassword,
            otp: OTP,
            otpExpires: expiryTime,
            isVerified: false
        });

        await newUser.save();

        // Send email with OTP
        const mailOptions = {
            to: email,
            subject: 'Email Verification OTP',
            text: `Your OTP for email verification is: ${OTP}`,
        };
        await transporter.sendMail(mailOptions);

        res.send({ status: "success", data: "User registered. Please verify your email." });
    } catch (error) {
        console.error("Error creating user: ", error);
        res.status(500).send({ status: "error", data: error.message });
    }
});
// Endpoint to verify OTP
app.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.send({ status: "error", data: "Email and OTP are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.send({ status: "error", data: "User not found" });
        }

        // Check if OTP matches and is not expired
        if (user.otp !== otp || user.otpExpires < new Date()) {
            return res.send({ status: "error", data: "Invalid or expired OTP" });
        }

        // Verify user
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.send({ status: "success", data: "Email verified successfully" });
    } catch (error) {
        console.error("OTP verification error: ", error);
        res.status(500).send({ status: "error", data: error.message });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.send({ status: "error", data: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.send({ status: "error", data: "User not found" });
        }

        if (!user.isVerified) {
            return res.send({ status: "error", data: "Email not verified" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.send({ status: "error", data: "Invalid password" });
        }

        res.send({ status: "success", data: "Login successful" });
    } catch (error) {
        console.error("Login error: ", error);
        res.status(500).send({ status: "error", data: error.message });
    }
});

// Generate a random token
const generateToken = () => crypto.randomBytes(20).toString('hex');

// Transporter setup for nodemailer (adjust as necessary)
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Endpoint to handle forgot password
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.send({ status: "error", data: "User not found" });
        }

        // Generate OTP
        const OTP = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
        const expiryTime = new Date();
        expiryTime.setMinutes(expiryTime.getMinutes() + 15); // OTP expiry time: 15 minutes

        // Update user document with OTP and expiry time
        user.resetPasswordOTP = OTP;
        user.resetPasswordExpires = expiryTime;
        await user.save();

        // Send email with OTP
        const mailOptions = {
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${OTP}`,
        };
        await transporter.sendMail(mailOptions);

        res.send({ status: "success", data: "OTP sent to your email" });
    } catch (error) {
        console.error("Forgot password error: ", error);
        res.status(500).send({ status: "error", data: error.message });
    }
});
app.post('/reset-password', async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.send({ status: "error", data: "User not found" });
        }

        // Check if OTP matches and is not expired
        if (user.resetPasswordOTP !== otp || user.resetPasswordExpires < new Date()) {
            return res.send({ status: "error", data: "Invalid or expired OTP" });
        }

        // Reset password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.send({ status: "success", data: "Password reset successful" });
    } catch (error) {
        console.error("Reset password error: ", error);
        res.status(500).send({ status: "error", data: error.message });
    }
});


app.post('/save-remarks', async (req, res) => {
    const { email, remarks } = req.body;

    if (!email || !remarks) {
        return res.send({ status: "error", data: "Email and remarks are required" });
    }

    try {
        const newRemark = new Remark({
            email,
            remarks,
        });

        await newRemark.save();
        res.send({ status: "success", data: "Remark saved successfully" });
    } catch (error) {
        console.error("Error saving remark: ", error);
        res.status(500).send({ status: "error", data: error.message });
    }
});

app.post('/submit-feedback', async (req, res) => {
    const { email, rating, feedback } = req.body;

    if (!email || !rating || !feedback) {
        return res.send({ status: "error", message: "All fields are required" });
    }

    try {
        const newFeedback = new Feedback({
            email,
            rating,
            feedback,
        });

        await newFeedback.save();
        res.send({ status: "success", message: "Feedback submitted successfully" });
    } catch (error) {
        console.error("Feedback submission error: ", error);
        res.status(500).send({ status: "error", message: error.message });
    }
});

app.get('/events', async (req, res) => {
    const { email } = req.query;
  
    try {
      const events = await Event.find({ email });
      const groupedEvents = events.reduce((acc, event) => {
        if (!acc[event.date]) acc[event.date] = [];
        acc[event.date].push(event);
        return acc;
      }, {});
      res.send({ status: 'success', events: groupedEvents });
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).send({ status: 'error', data: error.message });
    }
  });
  
  // Endpoint to create or update an event
  app.post('/event', async (req, res) => {
    const { date, text, email } = req.body;
  
    try {
      const newEvent = new Event({ date, text, email });
      await newEvent.save();
      res.send({ status: 'success', data: 'Event saved successfully' });
    } catch (error) {
      console.error('Error saving event:', error);
      res.status(500).send({ status: 'error', data: error.message });
    }
  });
  
  // Endpoint to delete an event
  app.delete('/event/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      await Event.findByIdAndDelete(id);
      res.send({ status: 'success', data: 'Event deleted successfully' });
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).send({ status: 'error', data: error.message });
    }
  });
// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//     User.findById(id, (err, user) => {
//         done(err, user);
//     });
// });

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "/auth/google/callback",
//     passReqToCallback: true
// },
//     async (request, accessToken, refreshToken, profile, done) => {
//         try {
//             let user = await User.findOne({ googleId: profile.id });
//             if (!user) {
//                 user = new User({
//                     googleId: profile.id,
//                     displayName: profile.displayName,
//                     image: profile.photos[0].value,
//                     email: profile.emails[0].value,
//                     isVerified: true
//                 });
//                 await user.save();
//             }
//             done(null, user);
//         } catch (error) {
//             done(error, null);
//         }
//     }
// ));

// app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// app.post('/auth/google/callback', async (req, res) => {
//   try {
//     const { idToken } = req.body;
//     const ticket = await client.verifyIdToken({
//       idToken,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });
//     const payload = ticket.getPayload();

//     let user = await User.findOne({ email: payload.email });
//     if (!user) {
//       user = new User({
//         googleId: payload.sub,
//         displayName: payload.name,
//         image: payload.picture,
//         email: payload.email,
//         isVerified: true
//       });
//       await user.save();
//     }

//     req.login(user, (err) => {
//       if (err) {
//         return res.status(500).send({ status: 'error', data: err.message });
//       }
//       return res.send({ status: 'success', data: 'User registered successfully' });
//     });
//   } catch (error) {
//     console.error('Google callback error:', error);
//     res.status(500).send({ status: 'error', data: 'Google sign-in failed' });
//   }
// });

// app.get("/login/success", async (req, res) => {
//   if (req.user) {
//     res.status(200).json({ message: "User logged in", user: req.user });
//   } else {
//     res.status(400).json({ message: "Not Authorized" });
//   }
// });


app.listen(port, () => {
    console.log(`Node.js server started on port ${port}`);
});
