const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const spaceSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    area: { type: String },
    contact: { type: String },
    security: { type: String },
    cameras: { type: Boolean },
    ownerSite: { type: Boolean, required: true },
    paidStaff: { type: Boolean, required: true },
    paidSecurity: { type: Boolean, required: true },
    climateControl: { type: Boolean, required: true },
    capacity: { type: String },
    fuel: { type: Boolean, required: true },
    rate_hour: { type: Number },
    rate_day: { type: Number },
    rate_week: { type: Number },
    rate_month: { type: Number },
    location: { type: Object },
    description: { type: String },
    images: [{ type: String }],
    available: { type: Boolean, default: true },
    managers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    reviews: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        review: { type: String },
        rating: { type: Number }
    }]
},
    { timestamps: true });

module.exports = mongoose.model('Space', spaceSchema);