const userDB = require("../models/userModel");
const response = require("../middlewares/responseMiddleware");
const asynchandler = require("express-async-handler");
const bcrypt = require("bcryptjs")
const jwt = require("../utils/jwt")
const test = asynchandler(async (req, res) => {
    response.successResponse(res, '', 'Auth routes established');
})
//register user
const register = asynchandler(async (req, res) => {
    const { name, email, password, phoneNumber, address, gender, dob } = req.body;
    if (!name || !email || !password || !phoneNumber || !address) {
        return response.validationError(res, 'Cannot register without proper information');
    }
    const findMail = await userDB.findOne({ email: email });
    if (findMail) {
        return response.errorResponse(res, 'Email id associated with another account', 400);
    }
    const findNumber = await userDB.findOne({ phoneNumber: phoneNumber });
    if (findNumber) {
        return response.errorResponse(res, 'PhoneNumber id associated with another account', 400);
    }
    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
    const newUser = new userDB({
        name: name,
        email: email,
        password: hashedPassword,
        phoneNumber: phoneNumber,
        address: address,
        gender,
        dob
    })
    const savedUser = await newUser.save();
    if (!savedUser) {
        return response.internalServerError(res, 'Cannot save the user');
    }
    const token = jwt(savedUser._id);
    const finalResult = {
        token: token,
        user: savedUser
    }
    response.successResponse(res, finalResult, 'Saved the user successfully');
})


//login user
const loginUser = asynchandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return response.validationError(res, "Cannot find the user without the details");
    }
    const findUser = await userDB.findOne({ email: email });
    if (!findUser) {
        return response.notFoundError(res, 'Cannot find the user');
    }
    const comparePassword = await bcrypt.compare(password, findUser.password);
    if (!comparePassword) {
        return response.errorResponse(res, 'Incorrect password', 400);
    }
    const token = jwt(findUser._id);
    const finalResult = {
        token: token,
        user: findUser
    }
    response.successResponse(res, finalResult, 'Login successful')
})

//change password


//forget password


module.exports = { test, register, loginUser }