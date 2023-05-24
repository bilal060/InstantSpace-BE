const express = require('express');
const { check } = require('express-validator');
const categoryController = require('../controllers/categoryController');
// const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', categoryController.getAllcategory);
router.get('/:id',categoryController.getcategory);

// router.get('/category_details/:sid', authController.protect, categoryController.categoryDetails);

router.post('/create_category',[
    check('name').not().isEmpty(),
    check('subcategories.*.name').not().isEmpty()
  ], categoryController.createcategory);

module.exports = router;