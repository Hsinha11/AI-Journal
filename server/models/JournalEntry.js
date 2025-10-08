import mongoose from 'mongoose';
const { Schema } = mongoose;

const journalEntrySchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId, // This will be a reference to a User
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.model('JournalEntry', journalEntrySchema);