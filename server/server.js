require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const mongoose = require("mongoose");
const User = require("./models/User.js"); // Assuming your model is in 'models/User.js'
const JournalEntry = require('./models/JournalEntry.js');
// Replace this with your actual connection string from Atlas
const MONGO_URI = process.env.MONGO_URI;

mongoose
    .connect(MONGO_URI)
    .then(() => console.log("Successfully connected to MongoDB Atlas."))
    .catch((err) => console.error("Connection error", err));
// THIS MUST BE a long, random string from an environment variable in a real app.
const JWT_SECRET =
    process.env.JWT_SECRET || "a-very-long-and-secure-random-string-for-dev";

const app = express();
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const port = 8000;
app.use(express.json());

// --- Middleware ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) {
        return res.status(401).json({ error: "Authorization token required" });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res
                .status(403)
                .json({ error: "Token is not valid or has expired" });
        }
        req.user = user;
        next();
    });
};

const checkAdmin = (req, res, next) => {
    // Defensive check
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        return res
            .status(403)
            .json({ error: "Access denied. Admin role required." });
    }
};

// --- Routes ---
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res
            .status(400)
            .json({ error: "Email and password are required." });
    }
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials." }); // Unauthorized
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // User is valid, create the JWT
        const userPayload = {
            id: user._id,
            name: user.username,
            isAdmin: user.username === "admin", // Keep your admin logic
        };
        const token = jwt.sign(userPayload, JWT_SECRET);
        res.json({ token });
        console.log(`User ${user.username} logged in.`); 
        // console.log(token);
        // Logging the username
        
    } catch (error) {
        res.status(500).json({ error: "Server error during login." });
    }
});

app.get("/api/admin", authenticateToken, checkAdmin, (req, res) => {
    res.json({
        message: `Welcome, Admin ${req.user.name}! You have accessed the admin-only area.`,
    });
});
app.post("/api/register", async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });
        res.status(201).json({
            message: "User created successfully",
            userId: newUser._id,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res
                .status(409)
                .json({ error: "Username or email already exists." });
        }
        res.status(500).json({ error: "Server error during registration." });
    }
});

app.post('/api/entries', authenticateToken, async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ error: 'Content is required.' });
        }

        const newEntry = new JournalEntry({
            content,
            author: req.user.id // Get the user ID from the authenticated token payload
        });

        await newEntry.save();
        res.status(201).json(newEntry);
    } catch (error) {
        res.status(500).json({ error: 'Server error creating entry.' });
    }
});

// GET all journal entries for the logged-in user
app.get('/api/entries', authenticateToken, async (req, res) => {
    try {
        const entries = await JournalEntry.find({ author: req.user.id }).sort({ createdAt: -1 });
        res.json(entries);
    } catch (error) {
        res.status(500).json({ error: 'Server error fetching entries.' });
    }
});

app.delete('/api/entries/:id', authenticateToken, async (req, res) => {
    try {
        const entryId = req.params.id;
        const userId = req.user.id;

        // The query to Mongoose must match BOTH the document's _id
        // and the author's ID to ensure a user can't delete another user's post.
        const deletedEntry = await JournalEntry.findOneAndDelete({
            _id: entryId,
            author: userId
        });

        // If findOneAndDelete returns null, the entry was not found OR not owned by the user.
        if (!deletedEntry) {
            return res.status(404).json({ error: 'Entry not found or user not authorized.' });
        }

        res.status(200).json({ message: 'Entry deleted successfully.' });

    } catch (error) {
        // This will catch errors like an invalid ObjectId format
        res.status(500).json({ error: 'Server error while deleting entry.' });
    }
});


app.put('/api/entries/:id',authenticateToken, async (req,res)=>{
     try{
        const {content} = req.body;
        const entryId = req.params.id;
        const userId = req.user.id;
        if (!content){
            return res.status(400).json({error:'Content cannot be empty'});
        }
        const updatedEntry = await JournalEntry.findOneAndUpdate(
            {_id:entryId,author:userId },

            {content:content},
            {new:true}
        )
        if(!updatedEntry){
            return res.status(404).json({error:"Entry not found or user not authorized"})
        }
        res.status(200).json(updatedEntry);
     }catch( error){
        res.status(500).json({error:"Server error while updating entry"})
     }
})


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
