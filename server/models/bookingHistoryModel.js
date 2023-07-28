const mongoose = require("mongoose");


const bookingHistorySchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    listingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"DroneListing"
    },
    date: {
        start: {
            type:String
        },
        end: {
            type:String
        }
    },
    time: {
        start: {
            type:String
        },
        end: {
            type:String
        }
    },
    noOfDays: {
        type: Number,
        default: 0
    },
    totalPrice: {
        type: Number,
        default: 0
    },
    plan: {
        type: String
    },
    paymentStatus: {
        type: String,
        required: true,
        default: "PENDING"
    },
    paymentDetails: {
        type: Object
    },
    bookingStatus: {
        type: String,
        required: true,
        default: "NOT CONFIRMED"
    }
}, { timestamps: true });

const bookingHistoryModel = mongoose.model("BookingHistory", bookingHistorySchema);

module.exports = bookingHistoryModel;