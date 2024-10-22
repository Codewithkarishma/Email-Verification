const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_DB)
    .then(() => {
        console.log('MongoDB connected successfully!');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

// User Schema without verificationToken
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
});

const User = mongoose.model('User', userSchema);

// Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// User Registration
app.post('/register', [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create a new user without verificationToken
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    // Generate a verification token
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const verificationLink = `http://localhost:${PORT}/verify/${verificationToken}`;
    
    // Send the verification email
    await transporter.sendMail({
        to: email,
        subject: 'Email Verification',
        text: `Click the link to verify your email: ${verificationLink}`,
    });

    res.status(201).json({ message: 'User registered. Check your email for verification.' });
});

// Email Verification
app.get('/verify/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { email } = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findOne({ email });
        if (!user) return res.status(400).send('User not found.');

        if (user.isVerified) {
            return res.status(400).send('User already verified.');
        }

        user.isVerified = true; // Set the user as verified
        await user.save();

        res.send('Email verified successfully!');
    } catch (err) {
        console.error(err);
        res.status(400).send('Invalid or expired token.');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
