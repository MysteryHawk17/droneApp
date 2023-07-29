const proposalDB = require("../models/proposalModels");
const response = require("../middlewares/responseMiddleware")
const asynhandler = require("express-async-handler");


const test = asynhandler(async (req, res) => {
    response.successResponse(res, '', 'Proposal routes established');
})

//create a proposal
const createProposal = asynhandler(async (req, res) => {
    const { description, deadline, budget, location } = req.body;
    if (!description || !deadline || budget == undefined || budget == null || !location) {
        return response.validationError(res, 'Cannot create a proposal without proper information');
    }
    const newProposal = new proposalDB({
        description: description,
        deadline: deadline,
        budget: budget,
        location: location
    })
    const savedProposal = await newProposal.save();
    if (!savedProposal) {
        return response.internalServerError(res, 'Failed to create a proposal');
    }
    response.successResponse(res, savedProposal, "Saved the proposal successfully");
})

//get all proposal with location filter
const getAllProposal = asynhandler(async (req, res) => {
    const { location, isBiddingActive } = req.query;
    const queryObj = {};
    if (location) {
        queryObj.location = location;
    }
    if (isBiddingActive !== undefined && isBiddingActive !== null) {
        queryObj.isBiddingActive = isBiddingActive;
    }
    const findProposal = await proposalDB.find(queryObj).populate({
        path: "bids.bidderId",
        populate: {
            path: "listedDrones"
        }
    });
    if (!findProposal) {
        return response.internalServerError(res, 'Failed to fetch the proposal');
    }
    response.successResponse(res, findProposal, "Successfully found the proposal");
})

//get a proposal for admin with all bids
const getParticularProposalAdmin = asynhandler(async (req, res) => {
    const { id } = req.params
    if (id == ":id") {
        return response.validationError(res, 'Cannot find a proposal without the id');
    }
    const findProposal = await proposalDB.findById({ _id: id }).populate({
        path: "bids.bidderId",
        populate: {
            path: "listedDrones"
        }
    });;
    if (!findProposal) {
        return response.notFoundError(res, "Cannot find the specified proposal");
    }
    response.successResponse(res, findProposal, 'Successfully fetched the proposal');
})

//get a proposal for owneres without bids info
const getParticularProposalOwner = asynhandler(async (req, res) => {
    const { id } = req.params
    if (id == ":id") {
        return response.validationError(res, 'Cannot find a proposal without the id');
    }
    const findProposal = await proposalDB.findById({ _id: id }).select("description deadline budget location isBiddingActive");
    if (!findProposal) {
        return response.notFoundError(res, "Cannot find the specified proposal");
    }
    response.successResponse(res, findProposal, 'Successfully fetched the proposal');
})


//update a proposal
const updateProposal = asynhandler(async (req, res) => {
    const { id } = req.params
    if (id == ":id") {
        return response.validationError(res, 'Cannot find a proposal without the id');
    }
    const findProposal = await proposalDB.findById({ _id: id });
    if (!findProposal) {
        return response.notFoundError(res, "Cannot find the specified proposal");
    }
    const { description, deadline, budget, location } = req.body;
    if (description) {
        findProposal.description = description;
    }
    if (deadline) {
        findProposal.deadline = deadline;
    }
    if (budget) {
        findProposal.budget = budget;
    }
    if (location) {
        findProposal.location = location;
    }
    const savedProposal = await findProposal.save();
    if (!savedProposal) {
        return response.internalServerError(res, "Failed to save the test");
    }
    response.successResponse(res, savedProposal, 'Successfully updated the proposal');
})

//change bid status
const updateBidStatus = asynhandler(async (req, res) => {
    const { id } = req.params
    if (id == ":id") {
        return response.validationError(res, 'Cannot find a proposal without the id');
    }
    const { isBiddingActive } = req.body;
    if (isBiddingActive == undefined || isBiddingActive == null) {
        return response.validationError(res, "cannot change bid status without the final status")
    }
    const findProposal = await proposalDB.findById({ _id: id });
    if (!findProposal) {
        return response.notFoundError(res, "Cannot find the specified proposal");
    }
    findProposal.isBiddingActive = isBiddingActive;
    const savedProposal = await findProposal.save();
    if (!savedProposal) {
        return response.internalServerError(res, "Failed to save the test");
    }
    response.successResponse(res, savedProposal, 'Successfully updated the proposal');
})

//delete a proposal
const deleteProposal = asynhandler(async (req, res) => {
    const { id } = req.params
    if (id == ":id") {
        return response.validationError(res, 'Cannot find a proposal without the id');
    }
    const findProposal = await proposalDB.findById({ _id: id }).select("description deadline budget location isBiddingActive");
    if (!findProposal) {
        return response.notFoundError(res, "Cannot find the specified proposal");
    }
    const deletedProposal = await proposalDB.findByIdAndDelete({ _id: id });
    if (!deletedProposal) {
        return response.internalServerError(res, 'Failed to delete the proposal');
    }
    response.successResponse(res, deletedProposal, "Successfully deleted the proposal");
})


//bid to a proposal
const bidToProposal = asynhandler(async (req, res) => {
    const { proposalId } = req.params;
    const userId = req.user._id;
    const { maxBid, minBid } = req.body;
    if (proposalId == ":proposalId" || !userId || maxBid == undefined || maxBid == null || minBid == undefined || minBid == null) {
        return response.validationError(res, "cannot bid without proper information");
    }
    const findProposal = await proposalDB.findById({ _id: proposalId });
    if (!findProposal) {
        return response.notFoundError(res, 'Cannot find the specified proposal');
    }
    const obj = {
        bidderId: userId,
        maxAmount: maxBid,
        minAmount: minBid
    }
    findProposal.bids.push(obj);
    const savedProposal = await findProposal.save();
    if (!savedProposal) {
        return response.internalServerError(res, 'Failed to bid');
    }
    response.successResponse(res, savedProposal, 'Saved the proposal successfully');
})

//retract bid
const retractBid = asynhandler(async (req, res) => {
    const { proposalId } = req.params;
    const userId = req.user._id;
    if (proposalId == ":proposalId" || !userId) {
        return response.validationError(res, 'Cannot retract bid without the proper information');
    }
    const findProposal = await proposalDB.findById({ _id: proposalId });
    if (!findProposal) {
        return response.notFoundError(res, 'Cannot find the specified proposal');
    }
    const con = userId.toString();
    const findIndex = findProposal.bids.findIndex((obj) => obj.bidderId == con);
    if (findIndex > -1) {
        findProposal.bids.splice(findIndex, 1);
    }
    const savedBid = await findProposal.save();
    if (!savedBid) {
        return response.internalServerError(res, 'Cannoot retract bid');
    }
    response.successResponse(res, savedBid, 'Retracted bid successfully');
})
//bid removed by admin
const removeBid = asynhandler(async (req, res) => {
    const { proposalId } = req.params;
    const { bidId } = req.body;
    if (proposalId == ":proposalId" || !bidId) {
        return response.validationError(res, 'Cannot retract bid without the proper information');
    }
    const findProposal = await proposalDB.findById({ _id: proposalId });
    if (!findProposal) {
        return response.notFoundError(res, 'Cannot find the specified proposal');
    }
    const findIndex = findProposal.bids.findIndex((obj) => obj._id == bidId);
    if (findIndex > -1) {
        findProposal.bids.splice(findIndex, 1);
    }
    const savedBid = await findProposal.save();
    if (!savedBid) {
        return response.internalServerError(res, 'Cannoot retract bid');
    }
    response.successResponse(res, savedBid, 'Retracted bid successfully');
})

//assign the bid to a owner
const assignWinner = asynhandler(async (req, res) => {
    const { winnerId } = req.body;
    const { proposalId } = req.params;
    if (!winnerId || proposalId == ":proposalId") {
        return response.validationError(res, 'Cannot assign the winner without its id or proposal id');
    }
    const findProposal = await proposalDB.findById({ _id: proposalId });
    if (!findProposal) {
        return response.notFoundError(res, 'Cannot find the specified proposal');
    }
    findProposal.bidWinner = winnerId;
    findProposal.isBiddingActive = false;
    const savedProposal = await findProposal.save();
    if (!savedProposal) {
        return response.internalServerError(res, 'Failed to save the proposal');
    }
    response.successResponse(res, savedProposal, 'Assigned the proposal to a owner.')

})

//get all assigned bids for an owner

const assignedProposals = asynhandler(async (req, res) => {
    const { ownerId } = req.params;
    if (ownerId == ":ownerId") {
        return response.validationError(res, 'Cannot find the bid without the owner id');
    }
    const findProposals = await proposalDB.find({ bidWinner: ownerId });
    if (!findProposals) {
        return response.internalServerError(res, 'Cannot fetch the bids');
    }
    response.successResponse(res, findProposals, 'Successfully fetched the bids');
})

module.exports = { test, createProposal, getAllProposal, getParticularProposalAdmin, getParticularProposalOwner, updateProposal, deleteProposal, bidToProposal, retractBid, removeBid, assignWinner, assignedProposals, updateBidStatus }