const express = require('express');
const { check } = require('express-validator');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const passport = require('../utils/passport');
const router = express.Router();
const checkPhoto = require('../Helper/photoUpload')
router.post('/signup', authController.signup);
router.post('/verifyotp',
[
  check('email')
    .not()
    .isEmpty(),
  check('otp')
    .not()
    .isEmpty()
],
 authController.verifyOTP);
router.post(
  '/add_card',
  authController.protect,
  [
    check('userId')
      .not()
      .isEmpty(),
    check('payment_method')
      .not()
      .isEmpty()
  ],
  authController.addUserCard
);
router.patch(
  '/UpdateUserProfile',
  authController.protect,
  checkPhoto.photoUpload,
  userController.updateUserProfile
);
router.get(
  '/signup/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get(
  '/signup/google/callback',
  passport.authenticate('google'),
  userController.signupWithGoogle
);
router.post(
  '/login',
  [
    check('email')
      .not()
      .isEmpty(),
    check('password')
      .not()
      .isEmpty()
  ],
  authController.login
);
router.post(
  '/forgotpassword',
  [
    check('email')
      .not()
      .isEmpty()
  ],
  authController.forgotpassword
);
router.patch(
  '/resetPassword',
  [
    check('email')
      .not()
      .isEmpty(),
    check('password')
      .not()
      .isEmpty(),
    check('passwordConfirm')
      .not()
      .isEmpty()
  ],
  authController.resetPassword
);
router.patch(
  '/updatePassword',
  [
    check('email')
      .not()
      .isEmpty(),
    check('password')
      .not()
      .isEmpty(),
    check('passwordConfirm')
      .not()
      .isEmpty()
  ],
  authController.protect,
  authController.updatePassword
);
router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);
router.delete(
  '/delete_card/:uid/:cid',
  authController.protect,
  authController.deleteUserCard
);
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
