// server/src/services/aiService.js
import { pipeline } from '@xenova/transformers';
import { Pinecone } from '@pinecone-database/pinecone';

class AIService {
    constructor() {
        this.extractor = null;
        this.pineconeIndex = null;
    }

    async init() {
        console.log("AI Service: Initializing...");
        
        this.extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        console.log("AI Service: Model loaded successfully.");

        const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
        this.pineconeIndex = pinecone.index('journal-app');
        console.log("AI Service: Pinecone initialized.");
    }

    async generateEmbedding(text) {
        if (!this.extractor) throw new Error("AI model not initialized.");
        const result = await this.extractor(text, { pooling: 'mean', normalize: true });
        return Array.from(result.data);
    }

   async upsertVector(id, vector, metadata = {}) { // Accept a metadata object
    if (!this.pineconeIndex) throw new Error("Pinecone not initialized.");
    await this.pineconeIndex.upsert([{ id, values: vector, metadata }]); // Pass it to Pinecone
}
    async deleteVector(id) {
        if (!this.pineconeIndex) throw new Error("Pinecone not initialized.");
        await this.pineconeIndex.deleteOne(id);
        console.log(`AI Service: Deleted vector for ID ${id}`);
    }
    async queryVectors(vector) {
        if (!this.pineconeIndex) throw new Error("Pinecone not initialized.");
        return this.pineconeIndex.query({ topK: 5, vector });
    }
}

const aiService = new AIService();
export default aiService;