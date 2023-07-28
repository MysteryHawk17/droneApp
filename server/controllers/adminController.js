const droneDB = require("../models/droneAvailableModel");
const userDB = require("../models/userModel");
const listingDB=require("../models/droneListingModel");
const response = require("../middlewares/responseMiddleware");
const asynchandler = require("express-async-handler");
const cloudinary = require("../utils/cloudinary")


const test = asynchandler(async (req, res) => {
    response.successResponse(res, '', "Drone test routes established");
})

//list drone
const createDrone = asynchandler(async (req, res) => {
    const { droneName } = req.body;
    if (!droneName || !req.file) {
        return response.validationError(res, 'Cannot add drone without proper information');
    }
    const findDrone = await droneDB.findOne({ droneName: droneName })
    if (findDrone) {
        return response.errorResponse(res, "Drone with the same name exists", 400);
    }

    const uploadedData = await cloudinary.uploader.upload(req.file.path, {
        folder: "DroneApp"
    })
    const newDrone = new droneDB({
        droneName: droneName,
        droneImage: uploadedData.secure_url
    })
    const savedDrone = await newDrone.save();
    if (!savedDrone) {
        return response.internalServerError(res, 'Cannot create the drone');
    }
    response.successResponse(res, savedDrone, "Successfully created the drone");
})
//getalldrone
const getAllDrone = asynchandler(async (req, res) => {
    const fetchDrones = await droneDB.find();
    if (!fetchDrones) {
        return response.internalServerError(res, 'Cannot fetch all the drones');
    }
    response.successResponse(res, fetchDrones, 'Fetched all the drones');
})

//get single drone
const getSingleDrone = asynchandler(async (req, res) => {
    const { droneId } = req.params;
    if (droneId == ":droneId") {
        return response.validationError(res, 'Cannot fetch the drone without id');
    }
    const findDrone = await droneDB.findById({ _id: droneId });
    if (!findDrone) {
        return response.notFoundError(res, 'Unable to find the drone');
    }
    response.successResponse(res, findDrone, 'Successfully found the drone');
})
//update drone
const updateDrone = asynchandler(async (req, res) => {
    const { droneId } = req.params;
    if (droneId == ":droneId") {
        return response.validationError(res, 'Cannot fetch the drone without id');
    }
    const findDrone = await droneDB.findById({ _id: droneId });
    if (!findDrone) {
        return response.notFoundError(res, 'Unable to find the drone');
    }
    const updateData = {};
    const { droneName } = req.body;
    if (droneName) {
        updateData.droneName = droneName;
    }
    if (req.file) {
        const deleteData = await cloudinary.uploader.destroy(findDrone.droneImage);
        const uploadedData = await cloudinary.uploader.upload(req.file.path, {
            folder: "DroneApp"
        })
        updateData.droneImage = uploadedData.secure_url;
    }
    const updatedDrone = await droneDB.findByIdAndUpdate({ _id: droneId }, updateData, { new: true });
    if (!updatedDrone) {
        return response.internalServerError(res, "Failed to delete the drone");
    }
    response.successResponse(res, updatedDrone, "Successfully updated the drone");
})
//delete drone
const deleteDrone = asynchandler(async (req, res) => {
    const { droneId } = req.params;
    if (droneId == ":droneId") {
        return response.validationError(res, 'Cannot fetch the drone without id');
    }
    const findDrone = await droneDB.findById({ _id: droneId });
    if (!findDrone) {
        return response.notFoundError(res, 'Unable to find the drone');
    }
    const deletedDrone = await droneDB.findByIdAndDelete({ _id: droneId });
    if (!deletedDrone) {
        return response.internalServerError(res, 'Unable to delete the drone');
    }

    response.successResponse(res, deletedDrone, 'Successfully deleted the drone');
})

//get all users
const getAllUsers = asynchandler(async (req, res) => {
    const { isOwner } = req.query;
    const queryObj = {};
    if (isOwner == true) {
        queryObj.isDroneOwner = true
    }
    const findUsers = await userDB.find(queryObj).populate("listedDrones");
    if (!findUsers) {
        return response.internalServerError(res, 'Cannot fetch the users information');
    }
    response.successResponse(res, findUsers, 'Fetched the user information successfully');
})


//get a user
const getUser=asynchandler(async(req,res)=>{
    const{id}=req.params;
    if(id==":id"){
        return response.validationError(res,"Cannot find a user without its id");
    }
    const findUser=await userDB.findById({_id:id}).populate("listedDrones");
    if(!findUser){
        return response.notFoundError(res,'Cannot find the specified user');
    }
    response.successResponse(res,findUser,"Found the specified user");
})




//delete user
const deleteUser=asynchandler(async(req,res)=>{
    const{id}=req.params;
    if(id==":id"){
        return response.validationError(res,"Cannot find a user without its id");
    }
    const findUser=await userDB.findById({_id:id});
    if(!findUser){
        return response.notFoundError(res,'Cannot find the specified user');
    }
    const deletedUser=await userDB.findByIdAndDelete({_id:id});
    if(!deletedUser){
        return response.internalServerError(res,'Failed to delete the user');
    }
    if(deletedUser.isDroneOwner){
        const deletedDrones=await listingDB.deleteMany({_id:{$in:deletedUser.listedDrones}})
        if(!deletedDrones){
            return response.successResponse(res,deletedUser,'Succesfully deleted the user but failed to delete the drones');
        }
    }
    response.successResponse(res,deletedUser,"Successfully deleted the user")
})

module.exports = { test, createDrone, getAllDrone, getSingleDrone, updateDrone, deleteDrone ,getAllUsers,getUser,deleteUser};