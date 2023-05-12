const express = require('express');
const { check } = require('express-validator');

const bookingController = require('../controllers/bookingController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get('/', authController.protect, bookingController.getAllBookings);

router.get('/user_bookings/:uid', authController.protect, bookingController.userBookings);

router.get('/booking_details/:sid', authController.protect, bookingController.bookingDetails);

router.post('/create_booking', authController.protect, [
    check('userId').not().isEmpty(),
    check('spaceId').not().isEmpty(),
    check('from').isTime().not().isEmpty(),
    check('to').isTime().not().isEmpty(),
    check('price').isInt().not().isEmpty(),
], bookingController.createBooking);

module.exports = router;