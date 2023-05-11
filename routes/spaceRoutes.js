const express = require('express');
const { check } = require('express-validator');

const spaceController = require('../controllers/spaceController');
const authController = require('./../controllers/authController');
const spaceUpload = require('../middlewares/space-upload');

const router = express.Router();

router.get('/', authController.protect, spaceController.getAllSpaces);

router.get('/single_space/:sid', authController.protect, spaceController.getSingleSpace);

router.get('/space/:uid', authController.protect, spaceController.getUserSpaces);

router.post('/add_space', authController.protect, spaceUpload.any('space_imgs'), [
    check('userId').not().isEmpty(),
    check('category').isString().isIn(['Truck', 'Car', 'Warehouse', 'Storage']).withMessage('Enter correct category value').not().isEmpty(),
    check('area').isString().not().isEmpty(),
    check('contact').isString().not().isEmpty(),
    check('security').optional({ checkFalsy: true }).isString().not().isEmpty(),
    check('cameras').isString().not().isEmpty(),
    check('capacity').isString().not().isEmpty(),
    check('fuel').optional({ checkFalsy: true }).isString().not().isEmpty(),
    check('rate_hour').isInt().not().isEmpty(),
    check('rate_day').isNumeric().not().isEmpty(),
    check('rate_week').isNumeric().not().isEmpty(),
    check('rate_month').isNumeric().not().isEmpty(),
    check('location').isString().not().isEmpty(),
    check('description').isString().not().isEmpty(),
], spaceController.addNewSpace);

module.exports = router;