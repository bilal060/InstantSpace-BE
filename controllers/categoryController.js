const { validationResult } = require('express-validator');

const AppError = require('../utils/appError');
const Space = require('../models/spaceModel');
const User = require('../models/userModel');
const category = require('../models/categoryModel');

/**
 * This function creates a new category by validating user and space details, updating space
 * availability, and saving the new category.
 * @param req - req stands for request and it is an object that contains information about the HTTP
 * request that was made, such as the request headers, request body, request parameters, etc.
 * @param res - `res` is the response object that is used to send the response back to the client. It
 * is an instance of the Express `Response` object and contains methods like `status`, `json`, `send`,
 * etc. that are used to send the response.
 * @param next - `next` is a function that is called when an error occurs in the current middleware
 * function. It passes the error to the next middleware function in the chain or to the error handling
 * middleware.
 * @returns The function `createcategory` is returning a response to the client with a status code of
 * 201 and a JSON object containing a message indicating that the category was created successfully.
 */
const createcategory = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new AppError('Invalid data received', 422));
    }

    const { userId, spaceId } = req.body;

    let userDetails;
    try {
        userDetails = await User.findById(userId);
    } catch (error) {
        console.log({ error });
        return next(new AppError('Error finding user', 500));
    };

    if (!userDetails) {
        return next(new AppError('No user found against id', 404));
    }

    let spaceDetails;
    try {
        spaceDetails = await Space.findById(spaceId);
    } catch (error) {
        console.log({ error });
        return next(new AppError('Error finding space', 500));
    }

    if (!spaceDetails) {
        return next(new AppError('No space found against id', 404));
    }

    spaceDetails.available = false;

    const newcategory = new category(req.body);

    try {
        await newcategory.save();
    } catch (error) {
        console.log({ error });
        return next(new AppError('Error creating new category', 500));
    };

    res.status(201).json({ message: 'category created successfully' });
};

/**
 * This function retrieves all category from a database and sends them as a JSON response.
 * @param req - req stands for request and it is an object that contains information about the HTTP
 * request that was made, such as the request headers, query parameters, and request body. It is passed
 * as the first parameter to the getAllcategory function.
 * @param res - `res` is the response object that is used to send the response back to the client. It
 * is an instance of the Express `Response` object and has methods like `json()`, `send()`, `status()`,
 * etc. that are used to send the response. In the above code
 * @param next - `next` is a function that is used to pass control to the next middleware function. It
 * is typically used to handle errors or to move on to the next function in the middleware chain. If an
 * error occurs in the current middleware function, calling `next` with an error object will trigger
 * the error
 * @returns This function returns a JSON object containing all the category fetched from the database.
 * The JSON object has a key "category" which holds an array of all the category.
 */
const getAllcategory = async (req, res, next) => {
    const options = {
        page: parseInt('1', 10),
        limit: parseInt('2', 10)
    };
    let allcategory;
    try {
        allcategory = await category.paginate({}, options);
    } catch (error) {
        console.log({ error });
        return next(new AppError("Error fetching category", 500));
    };

    res.json({ category: allcategory });
};

/**
 * This function retrieves all category made by a user with a given user ID.
 * @param req - req stands for request and it is an object that contains information about the HTTP
 * request that was made, such as the request headers, request parameters, request body, etc.
 * @param res - `res` stands for response. It is an object that represents the HTTP response that an
 * Express app sends when it receives an HTTP request. It contains methods for sending the response
 * back to the client, such as `json()` which sends a JSON response.
 * @param next - `next` is a function that is used to pass control to the next middleware function in
 * the request-response cycle. It is typically used to handle errors or to move on to the next
 * middleware function after completing a task. If an error occurs in the current middleware function,
 * calling `next` with an
 * @returns This code returns a JSON object containing an array of category records that belong to a
 * user with the specified user ID.
 */
const usercategory = async (req, res, next) => {
    const uid = req.params.uid;

    let usercategory;
    try {
        usercategory = await category.find({ userId: uid });
    } catch (error) {
        console.log({ error });
        return next(new AppError('Error fetching records', 500));
    };

    res.json({ usercategory });
};


/**
 * This function fetches category details by ID and returns them as a JSON response.
 * @param req - The req parameter is an object that represents the HTTP request made by the client. It
 * contains information about the request such as the request method, headers, URL, and parameters.
 * @param res - `res` is the response object that is used to send the response back to the client. It
 * is an instance of the `http.ServerResponse` class in Node.js. The `res` object has various methods
 * that can be used to send different types of responses such as JSON, HTML, text
 * @param next - `next` is a function that is used to pass control to the next middleware function in
 * the request-response cycle. It is typically used to handle errors or to move on to the next
 * middleware function in the chain. If an error occurs in the current middleware function, it can call
 * `next` with
 * @returns The function `categoryDetails` is returning a JSON response containing the category details
 * of a specific category ID. If the category ID is not found, it will return a 404 error. If there is an
 * error while fetching the record, it will return a 500 error.
 */
const categoryDetails = async (req, res, next) => {
    const sid = req.params.sid;

    let categoryDetails;
    try {
        categoryDetails = await category.findById(sid).populate("spaceId");
    } catch (error) {
        console.log({ error });
        return next(new AppError('Error fetching record', 500));
    };

    if (!categoryDetails) {
        return next(new AppError('No category found against id', 404));
    }

    res.json({ categoryDetails });
};

exports.createcategory = createcategory;
exports.getAllcategory = getAllcategory;
exports.usercategory = usercategory;
exports.categoryDetails = categoryDetails;