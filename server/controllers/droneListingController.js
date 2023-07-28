const listingDB = require('../models/droneListingModel');
const userDB = require("../models/userModel");
const response = require("../middlewares/responseMiddleware");
const asynchandler = require("express-async-handler");
const cloudinary = require("../utils/cloudinary")


const test = asynchandler(async (req, res) => {
    response.successResponse(res, '', 'Listing routes established');
})


//list a drone
const listDrone = asynchandler(async (req, res) => {
    const { price, droneModel, experience, pilotLicense, flightHours, videoLink, city, state, description, category } = req.body
    if (price == undefined || price == null || !droneModel || !experience || !videoLink || !city || !state || !description || !category || !req.file) {
        return response.validationError(res, 'Cannot list drone without proper information');
    }
    const id = req.user._id;
    const findUser = await userDB.findById({ _id: id });
    if (!findUser) {
        return response.notFoundError(res, "Email Address not registered");
    }
    var droneImage = '';
    if (req.file) {
        const uploadedData = await cloudinary.uploader.upload(req.file.path, {
            folder: "DroneApp"
        })
        droneImage = uploadedData.secure_url;
    }
    const checkListing = await listingDB.findOne({ userId: id, droneModel: droneModel });
    if (checkListing) {
        return response.errorResponse(res, "Same drone already registered under the email", 400);
    }
    const newListing = new listingDB({
        userId: id,
        price: price,
        droneModel: droneModel,
        experience: experience,
        pilotLicense: pilotLicense,
        flightHours: flightHours,
        videoLink: videoLink,
        city: city,
        state: state,
        description: description,
        droneImage: droneImage,
        category: JSON.parse(category)
    })
    const savedListing = await newListing.save();
    if (!savedListing) {
        return response.internalServerError(res, 'failed to list the product');
    }
    if (findUser.isDroneOwner == false) {
        findUser.isDroneOwner = true;

    }
    findUser.listedDrones.push(savedListing._id);
    await findUser.save();
    const findDrone = await listingDB.findById({ _id: savedListing._id }).populate("droneModel").populate("userId");
    if (!findDrone) {
        return response.successResponse(res, savedListing, 'Listed the product successfully');
    }
    response.successResponse(res, findDrone, 'Listed the product successfully');
})

//getall drone

const getAllDronesListing = asynchandler(async (req, res) => {
    const findAllListedDrones = await listingDB.find({}).populate("droneModel").populate("userId");;
    if (!findAllListedDrones) {
        return response.internalServerError(res, "Cannot fetch the drones");
    }
    response.successResponse(res, findAllListedDrones, 'Successfully fetched the listings');

})

//filter by category and city 
const filterDronesListings = asynchandler(async (req, res) => {
    const { category, city } = req.query;
    if (!category && !city) {
        return response.validationError(res, 'Cannot filter without parameer');
    }
    const queryObj={};
    if(city){
        queryObj.city=city;
    }
    if(category){
        queryObj.category=category;
    }
    const findDrones = await listingDB.find(queryObj);
    // const findDrones = await listingDB.find({ $or: [{ city: city }, { category: category }] });
    if (findDrones) {
        response.successResponse(res, findDrones, 'Successfully fetched the drones');
    }
    else {
        response.internalServerError(res, 'Cannot fetch the drones');
    }

})


//get a drone
const getAListedDrone = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (id == "id") {
        return response.validationError(res, 'Cannot get a drone without its id');
    }
    const findDrone = await listingDB.findById({ _id: id }).populate("droneModel").populate("userId");;
    if (!findDrone) {
        return response.internalServerError(res, 'Failed to fetch the drones');
    }
    response.successResponse(res, findDrone, 'Successfully fetched the drones');
})

//get all user listed drones
const userListedDrone = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (id == ":id") {
        return response.validationError(res, "Cannot fetch the drones for a user without the id id");
    }
    const findListedDrones = await listingDB.find({ userId: id }).populate("droneModel").populate("userId");;
    if (!findListedDrones) {
        return response.internalServerError(res, "Cannot fetch the drones ");
    }
    response.successResponse(res, findListedDrones, 'Fetched the drones successfully');
})
//update a listed drone
const updateListedDrones = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (id == "id") {
        return response.validationError(res, 'Cannot get a drone without its id');
    }
    const findDrone = await listingDB.findById({ _id: id }).populate("droneModel").populate("userId");;
    if (!findDrone) {
        return response.internalServerError(res, 'Failed to fetch the drones');
    }
    const { price, experience, pilotLicense, flightHours, videoLink, city, state, description, category } = req.body
    if (experience) {
        findDrone.experience = experience;
    }
    if (price) {
        findDrone.price = price;
    }
    if (pilotLicense == true) {
        findDrone.pilotLicense = pilotLicense;
    }
    if (req.file) {
        const deletedImaga = await cloudinary.uploader.destroy(findDrone.droneImage);
        const uploadedData = await cloudinary.uploader.upload(req.file.path, {
            folder: "DroneApp"
        });
        findDrone.droneImage = uploadedData.secure_url;
    }
    if (videoLink) {
        findDrone.videoLink = videoLink;
    }
    if (city) {
        findDrone.city = city;
    }
    if (state) {
        findDrone.state = state;
    }
    if (description) {
        findDrone.description = description;
    }
    if (category) {
        findDrone.category = JSON.parse(category);
    }
    const updatedDrone = await findDrone.save();
    if (!updatedDrone) {
        return response.internalServerError(res, 'Failed to update the drone');
    }
    response.successResponse(res, updatedDrone, 'Successfully updated the drone');
})

//delete a listed drone
const deleteListedDrone = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (id == "id") {
        return response.validationError(res, 'Cannot get a drone without its id');
    }
    const findDrone = await listingDB.findById({ _id: id });
    if (!findDrone) {
        return response.notFoundError(res, 'Cannot find the specified drones');
    }
    const deletedDrone = await listingDB.findByIdAndDelete({ _id: id });
    if (!deletedDrone) {
        return response.internalServerError(res, 'Failed to delete the drone');
    }
    const updatedUser = await userDB.findByIdAndUpdate({ _id: deletedDrone.userId }, {
        $pull: { listedDrones: deletedDrone._id }
    }, { new: true });
    if (!updatedUser) {
        return response.successResponse(res, deletedDrone, 'Deleted the drone but failed to update the ownerw');
    }

    response.successResponse(res, deletedDrone, 'Successfully deleted the drone and updated the owner');
})





module.exports = { test, listDrone, getAllDronesListing, getAListedDrone, updateListedDrones, deleteListedDrone, userListedDrone, filterDronesListings };