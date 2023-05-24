const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt')

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  subcategories: [{
    name:{type:String}
  }],
});
const category = mongoose.model('categories', categorySchema);

module.exports = category;
