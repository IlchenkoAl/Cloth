import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    login: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    cart: { type: Array, default: [] },
    bookmarks: { type: Array, default: [] },
    purchases: { type: Array, default: [] },
});

export default mongoose.model('User', userSchema);
