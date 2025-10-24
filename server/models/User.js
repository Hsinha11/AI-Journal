import mongoose from 'mongoose';
const { Schema } = mongoose;

/**
 * Mongoose schema for a user.
 * @type {mongoose.Schema}
 */
const userSchema = new Schema({
    /**
     * The username of the user.
     * @type {string}
     */
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    /**
     * The email of the user.
     * @type {string}
     */
    email: {
        type: String,
        required: true,
        unique: true
    },
    /**
     * The password of the user.
     * @type {string}
     */
    password: { // Corrected: removed unique: true
        type: String,
        required: true,
        minlength: 8,
        trim: true
        // maxlength is fine but not essential here
    },
    /**
     * The date the user was created.
     * @type {Date}
     */
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);
export default User;