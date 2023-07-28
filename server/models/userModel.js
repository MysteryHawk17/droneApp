const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true

    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,

    },
    gender: {
        type: String,
    },
    dob: {
        type: String,
    },
    isDroneOwner: {
        type: Boolean,
        required: true,
        default: false
    },
    listedDrones:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"DroneListing"
    }],
    //wallet
    //ratings
    rated:{
        type: Number,
        default: 0
    },
    ratings: [
        {
            rating: {
                type: Number,
                default: 0
            },
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }
    ]
})

const userModel=mongoose.model("User",userSchema);


module.exports=userModel