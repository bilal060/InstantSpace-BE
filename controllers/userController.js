const AppError = require('../utils/appError');
const User = require('./../models/userModel');
const Space = require('./../models/spaceModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const bcrypt = require('bcrypt');
const sendEmail = require('../utils/email');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
dotenv.config({ path: '../config.env' });

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
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(200).json({
    status: 'success',
    data: null
  });
});
/* This code exports a function called `updateUserProfile` that updates the user profile based on the
user's role. It first extracts the necessary fields from the request body and the user object. Then,
it checks the user's role and updates the user's profile accordingly. If the user's role is not
recognized, it returns an error. Finally, it updates the user's profile in the database and returns
a success message with the updated user object. */
exports.updateUserProfile = catchAsync(async (req, res, next) => {
  console.log(req.body);

  const options = { validateBeforeSave: false };
  const user = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true
  }).setOptions(options);

  if (!user) {
    return next(
      new AppError("No User Find Please Double Check What's the Issue", 400)
    );
  }
  res.status(200).json({
    status: 'Success',
    message: 'User Profile Update',
    data: {
      user
    }
  });
});

exports.updateUserCompany = catchAsync(async (req, res, next) => {
  const {
    fullName,
    phoneNo,
    dob,
    bio,
    companyName,
    companyPhone,
    companyLicenseNo,
    companyAddress,
    companyType
  } = req.body;
  const { role } = req.user;
  const options = { validateBeforeSave: false };
  let updatedFields = {};

  if (role === 'Truck Driver') {
    updatedFields = {
      truckType,
      drivingLicense,
      driverAddress,
      licensePhoto: req.file?.path
    };
  }
  else if (role === 'Storage Owner') {
    const companyDocpath = req.file?.path;
    updatedFields = {
      companyName,
      companyPhone,
      companyLicenseNo,
      companyAddress,
      // Categories,
      companyDoc: companyDocpath,
      companyType
    };
  }
  else {
    return next(new AppError('Invalid fields', 400));
  }
  const user = await User.findByIdAndUpdate(req.user.id, updatedFields, {
    new: true
  }).setOptions(options);

  if (!user) {
    return next(
      new AppError("No User Find Please Double Check What's the Issue", 400)
    );
  }
  res.status(200).json({
    status: 'Success',
    message: 'User Profile Update',
    data: {
      user
    }
  });
});

exports.signupWithGoogle = catchAsync(async (req, res, next) => {
  const user = new User({
    name: req.user.displayName,
    email: req.user.emails[0].value
  });
  await user.save({ validateBeforeSave: false });
  res.status(200).json({ user: user });
});

exports.managerInvitation = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Invalid data received', 422));
  }

  let existingUser;
  try {
    existingUser = await User.findOne({ email: req.body.email });
  } catch (error) {
    console.log(error);
    return next(new AppError('Error fetching data', 500));
  };

  if (existingUser) {
    return next(new AppError('Email already exists', 401));
  }

  if (!req.body.branch.match(/^[0-9a-fA-F]{24}$/)) {
    return next(new AppError('Invalid branch', 404));
  }

  let existingSpace;
  try {
    existingSpace = await Space.findById(req.body.branch);
  } catch (error) {
    console.log(error);
    return next(new AppError('Error fetching data', 500));

  }

  if (!existingSpace) {
    return next(new AppError('No branch found', 404));
  }

  const token = Math.floor(1000 + Math.random() * 9000).toString();

  let hashedToken;
  try {
    hashedToken = await bcrypt.hash(token, 12);
  } catch (error) {
    console.log(error);
    return next(new AppError('Error sending invitation', 500));
  }

  const message = `${process.env.SERVER_BASE_URL}/api/v1/users/verify-manager-invitation?token=${hashedToken}&email=${req.body.email}`;

  const newManager = new User({
    ...req.body,
    managerToken: hashedToken
  })

  try {
    await newManager.save({ validateBeforeSave: false });
  } catch (error) {
    console.log(error);
    return (new AppError('Error sending invitation', 500))
  }

  try {
    await sendEmail({
      email: req.body.email,
      subject: 'Manager Invitation',
      message
    })
    res.status(200).json({
      status: 'success',
      message: 'Invitation sent to manager'
    });
  } catch (err) {
    user.userValidotp = undefined;
    await user.save({ validateBeforeSave: false });
    return (new AppError('somting wrong to send email ', 500))
  }

};

exports.verifyInvitation = async (req, res, next) => {
  const { token, email } = req.query;

  let existingManager;
  try {
    existingManager = await User.findOne({ email });
  } catch (error) {
    console.log(error);
    return (new AppError('Error fetching manager', 500))
  }

  if (!existingManager) {
    return (new AppError('No manager found', 404))
  }

  if (existingManager.managerToken !== token) {
    return res.send("ERROR");
  }

  res.redirect(`${process.env.FRONTEND_URL}/auth/manager/register?email=${existingManager.email}`);

};

exports.deleteUser = factory.deleteOne(User);
exports.updateUser = factory.updateOne(User);
exports.createUser = factory.createOne(User);
exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
