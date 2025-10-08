import "dotenv/config";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User from "./models/User.js";
import JournalEntry from './models/JournalEntry.js';
import aiService from "./src/services/aiService.js";
const saltRounds = 10;
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

// In server/server.js
app.post("/api/entries", authenticateToken, async (req, res) => {
    const { content } = req.body;
    if (!content) {
        res.status(400);
        throw new Error("Content is required.");
    }

    // 1. Save the new entry to MongoDB (your source of truth)
    const newEntry = await JournalEntry.create({
        content,
        author: req.user.id,
    });

    // 2. Immediately generate embedding and update the Pinecone index
    try {
        const embedding = await aiService.generateEmbedding(newEntry.content);
        const metadata = {
        content: newEntry.content.substring(0, 1000)
    };
        await aiService.upsertVector(newEntry._id.toString(), embedding, metadata);
        console.log(`Successfully indexed new entry ${newEntry._id} in Pinecone with metadata.`);
    } catch (aiError) {
        // Log the error but don't cause the request to fail.
        // Saving the user's entry is the top priority.
        console.error("Real-time indexing to Pinecone failed:", aiError.message);
    }

    // 3. Send the success response to the client
    res.status(201).json(newEntry);
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
// server/server.js

app.delete("/api/entries/:id", authenticateToken, async (req, res) => {
    const entryId = req.params.id;

    // First, delete the entry from MongoDB
    const deletedEntry = await JournalEntry.findOneAndDelete({
        _id: entryId,
        author: req.user.id
    });

    if (!deletedEntry) {
        res.status(404);
        throw new Error("Entry not found or user not authorized.");
    }

    // --- YOUR NEW LOGIC HERE ---
    // Now, delete the corresponding vector from Pinecone
    try {
        await aiService.deleteVector(entryId);
    } catch (aiError) {
        // Log the error, but don't fail the request. Deleting from MongoDB is the priority.
        console.error("Pinecone delete failed but entry was removed from MongoDB:", aiError.message);
    }

    res.json({ message: 'Entry deleted successfully from all databases.' });
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

app.put("/api/entries/:id", authenticateToken, async (req, res) => {
    const { content } = req.body;
    if (!content) {
        res.status(400);
        throw new Error("Content cannot be empty.");
    }

    // 1. Update the entry in MongoDB and get the new version
    const updatedEntry = await JournalEntry.findOneAndUpdate(
        { _id: req.params.id, author: req.user.id },
        { content },
        { new: true }
    );

    if (!updatedEntry) {
        res.status(404);
        throw new Error("Entry not found or user not authorized.");
    }

    // 2. Immediately update the Pinecone index with the new embedding
    try {
        const embedding = await aiService.generateEmbedding(updatedEntry.content);
        const metadata = {
        content: updatedEntry.content.substring(0, 1000)
    };
        await aiService.upsertVector(updatedEntry._id.toString(), embedding,metadata);
        console.log(`Successfully updated vector for entry ${updatedEntry._id} in Pinecone with metadata`);
    } catch (aiError) {
        console.error("Pinecone update failed but entry was saved to MongoDB:", aiError.message);
    }

    // 3. Send the success response
    res.json(updatedEntry);
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

// server/server.js

app.get("/api/search", authenticateToken,async (req, res) => {
    const { q: query } = req.query;

    if (!query) {
        res.status(400);
        throw new Error("A search query 'q' is required.");
    }

    // 1. Generate an embedding for the user's query
    const queryEmbedding = await aiService.generateEmbedding(query);

    // 2. Query Pinecone to get the IDs of the most relevant entries
    const pineconeResponse = await aiService.queryVectors(queryEmbedding);
    const ids = pineconeResponse.matches.map(match => match.id);

    if (ids.length === 0) {
        return res.json([]); // Return empty array if no matches
    }

    // 3. Fetch the full documents from MongoDB using the retrieved IDs
    // We also ensure we only fetch entries belonging to the logged-in user for security
    const entries = await JournalEntry.find({ 
        '_id': { $in: ids },
        'author': req.user.id 
    });

    // 4. Re-sort the MongoDB results to match Pinecone's relevance ranking
    const entriesMap = new Map(entries.map(e => [e._id.toString(), e]));
    const sortedEntries = ids.map(id => entriesMap.get(id)).filter(Boolean);
    
    res.json(sortedEntries);
});
const startServer = async () => {
    await aiService.init();
    app.listen(port, () => {
        console.log(`Server listening at http://localhost:${port}`);
    });
};

startServer();
