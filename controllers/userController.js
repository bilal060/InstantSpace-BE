const AppError = require('../utils/appError');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
  exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  }); 
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});
exports.deleteMe = catchAsync(async (req, res, next) => {
 await User.findByIdAndUpdate(req.user.id,{active:false})

  res.status(200).json({
    status: 'success',
    data: null,
  });
});
exports.updateUserProfile = catchAsync(async (req, res, next) => {
  try {
    const { fullName, phoneNo, dob, bio } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, {
      fullName,
      phoneNo,
      dob,
      bio
    });

    if (!user) {
      // Handle the case when the document is not found
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'Success',
      message: 'User Profile Update',
      data: {
        user
      }
    });
  } catch (error) {
    // Log and handle any potential errors
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

exports.deleteUser = factory.deleteOne(User)
exports.updateUser = factory.updateOne(User)
exports.createUser = factory.createOne(User)
exports.getUser = factory.getOne(User)
exports.getAllUsers = factory.getAll(User)
