// server/src/services/aiService.js
import { pipeline } from '@xenova/transformers';
import { Pinecone } from '@pinecone-database/pinecone';

/**
 * Service for handling AI-related tasks.
 */
class AIService {
    /**
     * Initializes a new instance of the AIService class.
     */
    constructor() {
        this.extractor = null;
        this.pineconeIndex = null;
    }

    /**
     * Initializes the AI service.
     */
    async init() {
        console.log("AI Service: Initializing...");
        
        this.extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        console.log("AI Service: Model loaded successfully.");

        const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
        this.pineconeIndex = pinecone.index('journal-app');
        console.log("AI Service: Pinecone initialized.");
    }

    /**
     * Generates an embedding for the given text.
     * @param {string} text - The text to generate an embedding for.
     * @returns {Promise<number[]>} The generated embedding.
     */
    async generateEmbedding(text) {
        if (!this.extractor) throw new Error("AI model not initialized.");
        const result = await this.extractor(text, { pooling: 'mean', normalize: true });
        return Array.from(result.data);
    }

    /**
     * Upserts a vector into the Pinecone index.
     * @param {string} id - The ID of the vector.
     * @param {number[]} vector - The vector to upsert.
     * @param {object} metadata - The metadata to associate with the vector.
     */
   async upsertVector(id, vector, metadata = {}) { // Accept a metadata object
    if (!this.pineconeIndex) throw new Error("Pinecone not initialized.");
    await this.pineconeIndex.upsert([{ id, values: vector, metadata }]); // Pass it to Pinecone
}
    /**
     * Deletes a vector from the Pinecone index.
     * @param {string} id - The ID of the vector to delete.
     */
    async deleteVector(id) {
        if (!this.pineconeIndex) throw new Error("Pinecone not initialized.");
        await this.pineconeIndex.deleteOne(id);
        console.log(`AI Service: Deleted vector for ID ${id}`);
    }
    /**
     * Queries the Pinecone index for similar vectors.
     * @param {number[]} vector - The vector to query for.
     * @returns {Promise<object>} The query results.
     */
    async queryVectors(vector) {
        if (!this.pineconeIndex) throw new Error("Pinecone not initialized.");
        return this.pineconeIndex.query({ topK: 5, vector });
    }
}

const aiService = new AIService();
export default aiService;