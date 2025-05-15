// models/Message.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    senderId: String,
    receiverId: String,
    message: String,
    fileUrl: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Message', messageSchema);
