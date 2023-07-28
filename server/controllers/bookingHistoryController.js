const historyDB = require("../models/bookingHistoryModel");
const listingDB = require("../models/droneListingModel");
const userDB = require("../models/userModel");
const response = require("../middlewares/responseMiddleware");
const asynchandler = require("express-async-handler");


const test = asynchandler(async (req, res) => {
    response.successResponse(res, '', "History routes established");
})

//create history
const createHistory = asynchandler(async (req, res) => {
    const { listingId, date, time, noOfDays, totalPrice, plan } = req.body;
    const  userId  = req.user._id;
    if (!listingId || !date || !time || noOfDays == undefined || noOfDays == null || totalPrice == undefined || totalPrice == null || !plan) {
        return response.validationError(res, 'Cannot create a history without proper details');
    }
    const findListing = await listingDB.findById({ _id: listingId });
    if (!findListing) {
        return response.internalServerError(res, 'Cannot find the listing');
    }
    const newHistory = new historyDB({
        userId: userId,
        listingId: listingId,
        date: date,
        time: time,
        noOfDays: noOfDays,
        totalPrice: totalPrice,
        plan: plan
    })
    const savedHistory = await newHistory.save();
    if (!savedHistory) {
        return response.internalServerError(res, "Cannot save the history");
    }
    const findHistory = await historyDB.findById({ _id: savedHistory._id }).populate("userId").populate("listingId");
    if (!findHistory) {
        return response.successResponse(res, savedHistory, 'Successfully saved the history');
    }
    response.successResponse(res, findHistory, 'Successfully created the history');

})
//update booking for rescheduling


//update booking status
const updateBookingStatus = asynchandler(async (req, res) => {
    const { bookingId } = req.params;
    if (bookingId == ":bookingId") {
        return validationError(res, 'Cannot find booking details without the id');
    }
    const { status } = req.body;
    if (!status) {
        return response.validationError(res, "Cannot update status without the status");
    }
    const findBooking = await historyDB.findById({ _id: bookingId });
    if (!findBooking) {
        return response.notFoundError(res, 'Cannot find the specified booking');
    }
    findBooking.bookingStatus = status;
    if (status) {
        //handle completed
    }
    else if (status) {
        //handle confirmed
    }
    else if (status) {
        //handle cancelled 
    }

})

//get all boookinng for a user
const getAllUserBooking = asynchandler(async (req, res) => {
    const { userId } = req.params;
    if (userId == ":userId") {
        return response.validationError(res, 'Cannot get user without its id')
    }
    const findAllUserBookings = await historyDB.find({ userId: userId }).populate({
        path:"listingId",
        populate:{
            path:"droneModel"
        }
    }).populate("userId");
    if (!findAllUserBookings) {
        return response.internalServerError(res, "Cannot fetch the booking for a user");
    }
    response.successResponse(res, findAllUserBookings, 'Fetched the booking for the user');
})


//get all bookings for a owner
const getAllOwnerBookings = asynchandler(async (req, res) => {
    const { ownerId } = req.params;
    if (ownerId == ":ownerId") {
        return response.validationError(res, 'Cannot get the owner details without the id');
    }
    const findOwner = await userDB.findById({ _id: ownerId });
    if (!findOwner) {
        return response.notFoundError(res, "Cannot find the specified error");
    }
    console.log(findOwner);
    const findAllListings = await historyDB.find({
        listingId: { $in: findOwner.listedDrones }
    }).populate("userId").populate({
        path:"listingId",
        populate:{
            path:"droneModel"
        }
    });
    if (!findAllListings) {
        return response.internalServerError(res, "Cannot fetch the booking for a owner");
    }
    response.successResponse(res, findAllListings, 'Found the bookings successfully');

})

//get for a particular listing
const getAParticularListing = asynchandler(async (req, res) => {
    const { listingId } = req.params;
    if (listingId == ":listingId") {
        return response.validationError(res, 'Cannot get booking for a drone without the listing id');
    }
    const bookings = await historyDB.find({ listingId: listingId }).populate("userId").populate({
        path:"listingId",
        populate:{
            path:"droneModel"
        }
    });
    if (!bookings) {
        return response.internalServerError(res, 'Failed to fetch the bookings');
    }
    response.successResponse(res, bookings, 'Successfully fetched the bookings');
})

//get all booking for admin
const getAllBooking = asynchandler(async (req, res) => {
    const allBookings = await historyDB.find().populate("userId").populate({
        path:"listingId",
        populate:{
            path:"droneModel"
        }
    });
    if (!allBookings) {
        return response.internalServerError(res, 'Failed to find the bookings');
    }
    response.successResponse(res, allBookings, 'Successfully fetched the bookings');

})


//get a particular booking
const getABooking = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (id == ":id") {
        return response.validationError(res, 'cannot find a booking without its id');
    }
    const findBooking = await historyDB.findById({ _id: id }).populate("userId").populate({
        path:"listingId",
        populate:{
            path:"droneModel"
        }
    });
    if (!findBooking) {
        return response.internalServerError(res, 'Failed to fetch the requested data');
    }
    response.successResponse(res, findBooking, 'Successfully fetched the data');
})


//update payment status on webhook


//update payment status manually

module.exports = { test, createHistory, getAllBooking, getAParticularListing, getAllUserBooking, getAllOwnerBookings, getABooking };

/*
1-Payment final steps after which the payment status to be changed
2-land mapping wala flow check krna hai 
3-complete order hone pe wallet wala flow update krna hai 
4-withdrawl request ka sochna hai ki jaisa discuss kiya hai wahi rakhe ya kuch aur.
5-update the booking status and accordinly send the mails
*/