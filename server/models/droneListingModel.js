const mongoose = require("mongoose");



const listingSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    droneModel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Drone"
    },
    experience: {
        type: String,
        required: true
    },
    pilotLicense: {
        type: Boolean,
        required: true,
        default: false
    },
    flightHours: {
        type: Number,
        default:0
    },
    videoLink: {
        type: String,
        required: true
    },
    droneImage: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price:{
        type:Number,
        default:0,
        required:true
    },
    category: [String],
    
}, { timestamps: true });



const listingModel = mongoose.model("DroneListing", listingSchema);

module.exports = listingModel;