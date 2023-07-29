const mongoose = require("mongoose");


const proposalSchema = mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    deadline: {
        type: String,
        required: true
    },
    budget: {
        type: Number,
        default: 0
    },
    location: {
        type: String,
        required: true
    },
    isBiddingActive: {
        type: Boolean,
        required: true,
        default: true
    },
    bids: [{
        bidderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        maxAmount: {
            type: Number,
            default: 0
        },
        minAmount: {
            type: Number,
            default: 0
        }
    }],
    bidWinner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
}, { timestamps: true });

const proposalModel = mongoose.model("Proposal", proposalSchema);

module.exports = proposalModel;