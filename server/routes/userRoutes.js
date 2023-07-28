
const { test, getProfile, updateProfile, updateRating } = require("../controllers/userController");

const router = require("express").Router();
const { checkLogin } = require("../middlewares/authMiddleware");

router.get("/test", test);
router.get("/getprofile", checkLogin, getProfile);
router.put("/updateprofile", checkLogin, updateProfile);
router.put("/updaterating/:id", checkLogin, updateRating)

module.exports = router;