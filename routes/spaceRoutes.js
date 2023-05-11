const express = require('express');
const { check } = require('express-validator');

const messageController = require('../controllers/messageController');
const authController = require('./../controllers/authController');
const spaceUpload = require('../middlewares/space-upload');

const router = express.Router();

router.post('/media_message', authController.protect, spaceUpload.any('space_imgs'), [
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
], messageController.mediaMessage);

module.exports = router;