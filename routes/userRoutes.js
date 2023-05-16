const express = require('express');
const multer = require('multer');
const { check } = require('express-validator');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const fileUpload = require('../middlewares/docs-upload');
const profileUpload = require('../middlewares/profile-upload');
const router = express.Router();
router.post('/signup', authController.signup)
router.post('/verifyotp', authController.verifyOTP);
router.post('/add_card', authController.protect, [
  check('userId').not().isEmpty(),
  check('payment_method').not().isEmpty()
], authController.addUserCard);
router.patch('/UpdateUserProfile', authController.protect, (req, res, next) => {
  console.log(req.user.role)
  if (req.user.role === 'Business Owner') {
    console.log(req.user.role,'222')
    fileUpload.single('c_docs')(req, res, err => {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_UNEXPECTED_FILE') {
        err = null;
      }
      next(err);
    });
  } else {
    console.log('Else')
    profileUpload.single('profile_img')(req, res, err => {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_UNEXPECTED_FILE') {
        err = null;
      }
      next(err);
    });
  }
}, userController.updateUserProfile);

router.post('/login', authController.login)
router.post('/forgotpassword', authController.forgotpassword)
router.patch('/resetPassword', authController.resetPassword)
router.patch('/updatePassword', authController.protect, authController.updatePassword)
router.patch('/updateMe', authController.protect, userController.updateMe)
router.delete('/deleteMe', authController.protect, userController.deleteMe)
router.delete('/delete_card/:uid/:cid', authController.protect, authController.deleteUserCard)
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
