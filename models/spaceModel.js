const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const spaceSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: {
        type: String,
        enum: ['Truck', 'Car', 'Warehouse', 'Storage'],
        require: true
    },
    area: { type: String },
    contact: { type: String },
    security: { type: String },
    cameras: { type: String },
    capacity: { type: String },
    fuel: { type: String },
    rate_hour: { type: Number },
    rate_day: { type: Number },
    rate_week: { type: Number },
    rate_month: { type: Number },
    location: { type: String },
    description: { type: String },
    images: [{ type: String }],
},
    { timestamps: true });

module.exports = mongoose.model('Space', spaceSchema);