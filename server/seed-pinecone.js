// server/seed-pinecone.js
import "dotenv/config";
import mongoose from "mongoose";
import { Pinecone } from "@pinecone-database/pinecone";
import { pipeline } from "@xenova/transformers";
import JournalEntry from "./models/JournalEntry.js";

async function seedDatabase() {
    console.log("--- Starting Pinecone Seeding Script ---");

    try {
        // 1. Initialize Connections
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected.");

        const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
        const index = pinecone.index("journal-app");
        console.log("Pinecone initialized.");

        // 2. Load AI Model
        console.log("Loading feature extraction model...");
        const extractor = await pipeline(
            "feature-extraction",
            "Xenova/all-MiniLM-L6-v2"
        );
        console.log("Model loaded.");

        // 3. Fetch Data from MongoDB
        console.log("Fetching journal entries...");
        const entries = await JournalEntry.find({}, "content");
        console.log(`Found ${entries.length} entries to process.`);

        // 4. Generate Embeddings and Upsert
        for (const entry of entries) {
            if (!entry.content) continue;

            console.log(`Processing entry ID: ${entry._id}`);
            const embedding = await extractor(entry.content, {
                pooling: "mean",
                normalize: true,
            });

            const vector = {
                id: entry._id.toString(),
                values: Array.from(embedding.data),
                metadata: {
                    content: entry.content.substring(0, 1000), // Store the first 1000 chars as a preview
                },
            };

            await index.upsert([vector]);
        }

        console.log("--- Seeding complete. ---");
    } catch (error) {
        console.error("An error occurred during seeding:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
    }
}

seedDatabase();
