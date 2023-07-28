const { test, createDrone, getAllDrone, getSingleDrone, updateDrone, deleteDrone, getAllUsers, getUser, deleteUser } = require("../controllers/adminController");

const router = require("express").Router();
const upload = require("../utils/multer");


router.get("/test", test);
router.post("/create", upload.single("image"), createDrone);
router.get("/getalldrone", getAllDrone);
router.get("/getdrone/:droneId", getSingleDrone)
router.put("/updatedrone/:droneId", upload.single("image"), updateDrone)
router.delete("/deletedrone/:droneId", deleteDrone)
router.get("/getallusers", getAllUsers)
router.get("/getuser/:id", getUser);
router.delete("/deleteuser/:id", deleteUser);
module.exports = router;