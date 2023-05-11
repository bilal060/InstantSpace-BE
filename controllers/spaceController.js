const { validationResult } = require('express-validator');

const AppError = require('../utils/appError');
const Space = require('../models/spaceModel');
const User = require('../models/userModel');

const addNewSpace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new AppError('Invalid data received', 422));
    }

    const imagesPath = req?.files.map(img => img.path);

    const newSpace = new Space({
        ...req.body,
        images: imagesPath
    });

    try {
        await newSpace.save();
    } catch (error) {
        console.log(error);
        return next(new AppError("Error adding new space", 500));
    }
    res.status(201).json({ message: 'Space added successfully' });
};

const getAllSpaces = async (req, res, next) => {
    let allSpaces;
    try {
        allSpaces = await Space.find({});
    } catch (error) {
        console.log({ error });
        return next(new AppError('Error fetching spaces', 500));
    };

    res.json({ spaces: allSpaces });
};

const getSingleSpace = async (req, res, next) => {
    const sid = req.params.sid;

    let singleSpace;
    try {
        singleSpace = await Space.findById(sid);
    } catch (error) {
        console.log({ error });
        return next(new AppError('Error finding space', 500));
    };

    if (!singleSpace) {
        return next(new AppError('No space found against id', 404));
    }

    res.json({ space: singleSpace });
};

const getUserSpaces = async (req, res, next) => {
    const uid = req.params.uid;

    let userDetails;
    try {
        userDetails = await User.findById(uid);
    } catch (error) {
        console.log({ error });
        return next(new AppError('Error finding spaces', 500));
    };

    console.log(userDetails);

    if (!userDetails) {
        return next(new AppError('No user found against id', 404));
    }

    let allSpaces;
    try {
        allSpaces = await Space.find({ userId: uid });
    } catch (error) {
        console.log({ error });
        return next(new AppError('Error finding spaces', 500));
    };

    res.json({ spaces: allSpaces });
};

exports.addNewSpace = addNewSpace;
exports.getAllSpaces = getAllSpaces;
exports.getSingleSpace = getSingleSpace;
exports.getUserSpaces = getUserSpaces;

