const { validationResult } = require('express-validator');
const AppError = require('../utils/appError');
const Category = require('../models/categoryModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

const createcategory = catchAsync(async (req, res, next) => {
    const { name, subcategories } = req.body;
    const newcategory = new Category({
        name,
        subcategories
      });
        await newcategory.save();
    res.status(201).json({ message: 'category created successfully' });
});
const Updatecategory = catchAsync(async (req, res, next) => {
    const { name, subcategories } = req.body;
   const updateCategory =  await  Category.findByIdAndUpdate(
        req.params.id,
        { $set: { name, subcategories } },
        { new: true },)
    res.status(201).json({ 
        message: 'Update category successfully',
        category:updateCategory
    });
});
const getAllcategory = factory.getAll(Category)
const deletecategory = factory.deleteOne(Category)
const getcategory = factory.getOne(Category)
exports.createcategory = createcategory;
exports.getAllcategory = getAllcategory;
exports.deletecategory = deletecategory;
exports.getcategory = getcategory;
exports.Updatecategory = Updatecategory; 