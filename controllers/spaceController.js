const { validationResult } = require('express-validator');

const AppError = require('../utils/appError');
const Space = require('../models/spaceModel');
const User = require('../models/userModel');

/**
 * This function adds a new space to a database with images and returns a success message or an error
 * message if there are any issues.
 * @param req - req stands for request and it is an object that contains information about the HTTP
 * request that was made, such as the request headers, request parameters, request body, etc.
 * @param res - `res` is the response object that is used to send the response back to the client. It
 * contains methods like `status` to set the HTTP status code, `json` to send a JSON response, and
 * `send` to send a plain text response. In this code, `res`
 * @param next - next is a function that is called to pass control to the next middleware function in
 * the stack. It is typically used to handle errors or to move on to the next function in the chain of
 * middleware functions.
 * @returns The function `addNewSpace` is returning a response to the client. If there are validation
 * errors in the request, it returns an error response with a status code of 422 and an error message.
 * If there are no validation errors, it creates a new `Space` object with the request body and the
 * paths of the uploaded images, saves it to the database, and returns a success response with
 */
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

/**
 * This function retrieves all spaces from a database and sends them as a JSON response.
 * @param req - req stands for request and it is an object that contains information about the HTTP
 * request that was made, such as the request headers, query parameters, and request body. It is passed
 * as the first parameter to this function.
 * @param res - `res` is the response object that is used to send the response back to the client. It
 * is an instance of the `http.ServerResponse` class in Node.js. The `res.json()` method is used to
 * send a JSON response to the client with the `spaces` property containing the array
 * @param next - "next" is a function that is called when an error occurs or when the current
 * middleware function has completed its task and wants to pass control to the next middleware function
 * in the chain. It is typically used in Express.js middleware functions to pass control to the error
 * handling middleware or to the next middleware function
 * @returns This function is returning a JSON object with a key of "spaces" and a value of an array of
 * all the spaces fetched from the database using the Mongoose `find()` method. If there is an error,
 * it will return a custom error message with a status code of 500.
 */
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

/**
 * This function retrieves a single space by its ID and returns it as a JSON object in the response.
 * @param req - req stands for request and it is an object that contains information about the HTTP
 * request that was made, such as the request headers, request parameters, request body, etc.
 * @param res - `res` is the response object that is used to send the response back to the client. It
 * is an instance of the Express `Response` object and has methods like `json()`, `send()`, `status()`,
 * etc. that are used to send the response back to the client.
 * @param next - `next` is a function that is used to pass control to the next middleware function in
 * the stack. It is typically used to handle errors or to move on to the next function in the chain of
 * middleware functions. If an error occurs in the current middleware function, it can call `next` with
 * @returns This code defines an asynchronous function called `getSingleSpace` that takes in a request
 * object (`req`), a response object (`res`), and a `next` function as parameters.
 */
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

/**
 * This function retrieves all spaces associated with a user ID and returns them as a JSON object.
 * @param req - req stands for request and it is an object that contains information about the HTTP
 * request that was made, such as the request parameters, headers, and body.
 * @param res - `res` is the response object that is used to send the response back to the client. It
 * is an instance of the Express `Response` object and has methods like `json()`, `send()`, `status()`,
 * etc. that are used to send the response data and set the response
 * @param next - next is a function that is called to pass control to the next middleware function in
 * the stack. It is typically used to handle errors or to move on to the next function in the chain of
 * middleware functions.
 * @returns This code defines an asynchronous function called `getUserSpaces` that takes in a request
 * object (`req`), a response object (`res`), and a `next` function as parameters.
 */
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

