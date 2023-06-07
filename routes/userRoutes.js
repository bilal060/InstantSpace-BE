const express = require('express');
const { check } = require('express-validator');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const passport = require('../utils/passport');
const router = express.Router();
const checkPhoto = require('../Helper/photoUpload')
const profileUpload = require('../middlewares/profile-upload');

router.post('/signup', authController.signup);
router.post('/google-login', [
  check('token').not().isEmpty()
], authController.googleLogin);

router.post('/manager-invitation', [
  check('fullName').not().isEmpty(),
  check('email').not().isEmpty(),
  check('phoneNo').not().isEmpty(),
  check('branch').isString().not().isEmpty(),
  check('slot').isObject().not().isEmpty(),
], userController.managerInvitation);

router.get('/verify-manager-invitation', userController.verifyInvitation);

router.patch('/manager_resgister', userController.managerRegister);

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
  profileUpload.single('profile_img'),
  userController.updateUserProfile
);

router.patch(
  '/UpdateCompanyProfile',
  authController.protect,
  checkPhoto.photoUpload,
  userController.updateUserCompany
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
