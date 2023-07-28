const userDB = require("../models/userModel");
const response = require("../middlewares/responseMiddleware");
const asynchandler = require("express-async-handler");
const { default: mongoose } = require("mongoose");

//test 
const test = asynchandler(async (req, res) => {
    response.successResponse(res, '', "User routes established");
})

//get a user profile
const getProfile = asynchandler(async (req, res) => {
    const id = req.user._id;
    const findProfile = await userDB.findById({ _id: id }).populate("listedDrones");
    if (!findProfile) {
        return response.internalServerError(res, "Failed to fetch the profile");
    }
    response.successResponse(res, findProfile, "Fetched the profile successfully");
})



//update profile
const updateProfile = asynchandler(async (req, res) => {
    const id = req.user._id;
    const findProfile = await userDB.findById({ _id: id }).populate("listedDrones");
    if (!findProfile) {
        return response.internalServerError(res, "Failed to fetch the profile");
    }
    const { address, gender, dob, name } = req.body;
    if (address) {
        findProfile.address = address;
    }
    if (gender) {
        findProfile.gender = gender;
    }
    if (dob) {
        findProfile.dob = dob;
    }
    if (name) {
        findProfile.name = name;
    }
    const savedUser = await findProfile.save();
    if (!savedUser) {
        return response.internalServerError(res, 'Cannot update the user');
    }
    response.successResponse(res, savedUser, 'Updated the user successfully');
})

//update mail


//update phone



//update ratings for user

const updateRating = asynchandler(async (req, res) => {
    const userId = req.user._id;
    const { rating } = req.body;
    const { id } = req.params;
    if (!userId || rating == undefined || rating == null || id == ":id") {
        return response.validationError(res, 'Cannot rate without proper information');
    }
    const findUser = await userDB.findById({ _id: id });
    if (!findUser) {
        return response.internalServerError(res, 'Failed to fetch the user');
    }
    // console.log(findUser.ratings)
    const com = userId.toString();
    const findIndex = findUser.ratings.findIndex((obj) => obj.userId == com);
    // console.log(findIndex)
    if (findIndex > -1) {
        const prevRating = findUser.rated * findUser.ratings.length;
        const rating = findUser.ratings[findIndex].rating;
        findUser.ratings.splice(findIndex, 1);
        const newRating = (prevRating - rating) / findUser.ratings.length;
        findUser.rated = newRating;
        const updated = await findUser.save();
        if (!updated) {
            return response.internalServerError(res, 'Cannot update rating');
        }
        response.successResponse(res, updated, "updated the ratings")

    }
    else {
        const prevRating = findUser.rated * findUser.ratings.length;
        const history = {
            rating: rating,
            userId: userId
        }

        const newArray = [...findUser.ratings, history];
        findUser.ratings = newArray;
        const newRating = (prevRating + rating) / findUser.ratings.length;
        findUser.rated = newRating;
        const updated = await findUser.save();
        if (!updated) {
            return response.internalServerError(res, 'Cannot update rating');
        }
        response.successResponse(res, updated, "updated the ratings")
    }


})


module.exports = { test, getProfile, updateProfile, updateRating }