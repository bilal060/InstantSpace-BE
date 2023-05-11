const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    conversationId: { type: String },
    sender: { type: String },
    message: { type: String }
},
    { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);