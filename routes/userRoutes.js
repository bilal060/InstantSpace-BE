const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();
router.post('/signup',authController.signup)
router.post('/verifyotp',authController.verifyOTP)
router.post('/UpdateUserProfile/:id',authController.protect,authController.restrictTo('Customer'),userController.updateUserProfile)
router.post('/login',authController.login)
router.post('/forgotpassword',authController.forgotpassword)
router.patch('/resetPassword/:otp',authController.resetPassword)
router.patch('/updatePassword',authController.protect,authController.updatePassword)
router.patch('/updateMe',authController.protect,userController.updateMe)
router.delete('/deleteMe',authController.protect,userController.deleteMe)
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
