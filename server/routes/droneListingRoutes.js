const { test, listDrone, getAllDronesListing, getAListedDrone, updateListedDrones, deleteListedDrone, userListedDrone, filterDronesListings } = require("../controllers/droneListingController");

const router = require("express").Router();
const upload = require("../utils/multer")
const {checkLogin}=require("../middlewares/authMiddleware")

router.get("/test", test);
router.post("/listdrone",checkLogin, upload.single("image"), listDrone);
router.get("/getalllisting", getAllDronesListing)
router.get("/getlisteddrone/:id", getAListedDrone);
router.get("/userlisteddrones/:id", userListedDrone);
//filter
router.get("/filterdronelisting",filterDronesListings)
router.put("/updatelisteddrone/:id", upload.single("image"), updateListedDrones);
router.delete('/deletelisteddrone/:id', deleteListedDrone)


module.exports = router;