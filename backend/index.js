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

// User Schema
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
    
    const newUser = new User({ email, password: hashedPassword });
    try {
        await newUser.save();
        
        // Generate a verification token
        const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const verificationLink = `https://email-verification-krmc.onrender.com/verify/${verificationToken}`; // Change to your frontend URL

        // Send the verification email
        await transporter.sendMail({
            to: email,
            subject: 'Email Verification',
            text: `Click the link to verify your email: ${verificationLink}`,
        });

        res.status(201).json({ message: 'User registered. Check your email for verification.' });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'User already registered with this email.' });
        }
        console.error('Error during user registration:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Email Verification
app.get('/verify/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { email } = jwt.verify(token, process.env.JWT_SECRET);
         console.log('Decoded email from token:', email);
        const user = await User.findOne({ email });
        if (!user) return res.status(400).send('User not found.');

        if (user.isVerified) {
            const authToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).json({ message: 'User already verified.', token: authToken });
        }

        user.isVerified = true; // Set the user as verified
        await user.save();

        const authToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Email verified successfully!', token: authToken }); // Send token in the response
    } catch (err) {
        console.error(err);
        res.status(400).send('Invalid or expired token.');
    }
});

// User Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials.' });
    }

    if (!user.isVerified) {
        return res.status(400).json({ message: 'Email not verified. Please check your email.' });
    }

    const authToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful!', token: authToken }); // Send token in the response
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
