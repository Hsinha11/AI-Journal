import mongoose from 'mongoose';
const { Schema } = mongoose;

/**
 * Mongoose schema for a journal entry.
 * @type {mongoose.Schema}
 */
const journalEntrySchema = new Schema({
    /**
     * The content of the journal entry.
     * @type {string}
     */
    content: {
        type: String,
        required: true,
    },
    /**
     * The author of the journal entry.
     * @type {mongoose.Schema.Types.ObjectId}
     */
    author: {
        type: Schema.Types.ObjectId, // This will be a reference to a User
        ref: 'User',
        required: true,
    },
    /**
     * The date the journal entry was created.
     * @type {Date}
     */
    createdAt: {
        type: Date,
        default: Date.now
    },
    /**
     * The date the journal entry was last updated.
     * @type {Date}
     */
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.model('JournalEntry', journalEntrySchema);