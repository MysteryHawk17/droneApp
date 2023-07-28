const mongoose=require("mongoose");



const droneSchema=mongoose.Schema({
    droneName:{
        type:String,
        required:true
    },
    droneImage:{
        type:String,
        required:true
    }
},{timestamps:true});


const droneModel=mongoose.model("Drone",droneSchema);

module.exports=droneModel;