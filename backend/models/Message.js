const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  exchanged: [
    { from: String, text: String, timestamp: Date }
  ],
}, { timestamps: true });
module.exports = mongoose.model('Message', MessageSchema);