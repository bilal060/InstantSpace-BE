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

    const { fullName, phoneNo, dob, bio, cType, cPhone, cLicenseNo, cDoc } = req.body;
    const { role } = req.user;
    const options = { validateBeforeSave: false };
    let updatedFields = {};
    if (role === 'Customer') {
      updatedFields = { fullName, phoneNo, dob, bio };
    } else if (role === 'Business Owner') {
      const cDocPath = req.file?.path
      updatedFields = {  cType, cPhone, cLicenseNo, cDoc :cDocPath};
    } else {
      return next(new AppError('Invalid user role', 400));
    }
    const user = await User.findByIdAndUpdate(req.user.id, updatedFields, { new: true }).setOptions(options);;

    if (!user) {
      return next(new AppError("No User Find Please Double Check What's the Issue", 400));
    }
    res.status(200).json({
      status: 'Success',
      message: 'User Profile Update',
      data: {
        user
      }
    });
});


exports.deleteUser = factory.deleteOne(User)
exports.updateUser = factory.updateOne(User)
exports.createUser = factory.createOne(User)
exports.getUser = factory.getOne(User)
exports.getAllUsers = factory.getAll(User)
