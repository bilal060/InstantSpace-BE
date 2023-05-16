const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    spaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Space', required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    price: { type: Number, required: true },
    payment: { type: Boolean, default: false },
},
    { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);