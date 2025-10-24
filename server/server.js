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

/**
 * Initializes the database connection.
 * Exits the process if the connection fails.
 */
const initializeDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Successfully connected to MongoDB Atlas.");
    } catch (err) {
        console.error("MongoDB Connection error:", err);
        process.exit(1); // Exit if we can't connect to the database
    }
};

// THIS MUST BE a long, random string from an environment variable in a real app.
const JWT_SECRET = process.env.JWT_SECRET || "a-very-long-and-secure-random-string-for-dev";

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
/**
 * Middleware to authenticate a token.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
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

/**
 * Middleware to check if a user is an admin.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
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
/**
 * Route for user login.
 * @name post/api/login
 * @function
 * @memberof module:server/server
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res
            .status(400)
            .json({ error: "Email and password are required." });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format." });
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

/**
 * Route for admin access.
 * @name get/api/admin
 * @function
 * @memberof module:server/server
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
app.get("/api/admin", authenticateToken, checkAdmin, (req, res) => {
    res.json({
        message: `Welcome, Admin ${req.user.name}! You have accessed the admin-only area.`,
    });
});
/**
 * Route for user registration.
 * @name post/api/register
 * @function
 * @memberof module:server/server
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
app.post("/api/register", async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format." });
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

/**
 * Route to create a new journal entry.
 * @name post/api/entries
 * @function
 * @memberof module:server/server
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
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

/**
 * Route to get all journal entries for the logged-in user.
 * @name get/api/entries
 * @function
 * @memberof module:server/server
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
app.get('/api/entries', authenticateToken, async (req, res) => {
    try {
        const entries = await JournalEntry.find({ author: req.user.id }).sort({ createdAt: -1 });
        res.json(entries);
    } catch (error) {
        res.status(500).json({ error: 'Server error fetching entries.' });
    }
});
/**
 * Route to delete a journal entry.
 * @name delete/api/entries/:id
 * @function
 * @memberof module:server/server
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
/**
 * Route to delete a journal entry by id
 * @name delete/api/entries/:id
 * @function
 * @memberof module:server/server
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
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

/**
 * Route to update a journal entry.
 * @name put/api/entries/:id
 * @function
 * @memberof module:server/server
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
/**
 * Route to update a journal entry by id
 * @name put/api/entries/:id
 * @function
 * @memberof module:server/server
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
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

/**
 * Route to search for journal entries.
 * @name get/api/search
 * @function
 * @memberof module:server/server
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
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
/**
 * Starts the server.
 */
const startServer = async () => {
    await aiService.init();
    // Start the server only after database connection is established
    initializeDatabase().then(() => {
        app.listen(8000, '0.0.0.0', () => {
        console.log(`Server listening at http://localhost:${port}`);}
    )});
};

startServer();
