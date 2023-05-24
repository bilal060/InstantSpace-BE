const express = require('express');
const { check } = require('express-validator');

const categoryController = require('../controllers/categoryController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.protect, categoryController.getAllcategory);

router.get('/user_category/:uid', authController.protect, categoryController.usercategory);

router.get('/category_details/:sid', authController.protect, categoryController.categoryDetails);

router.post('/create_category', authController.protect, [
    check('userId').not().isEmpty(),
    check('spaceId').not().isEmpty(),
    check('from').isTime().not().isEmpty(),
    check('to').isTime().not().isEmpty(),
    check('price').isInt().not().isEmpty(),
], categoryController.createcategory);

module.exports = router;