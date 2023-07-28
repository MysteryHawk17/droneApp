const { test, createHistory, getAllBooking, getABooking, getAllOwnerBookings, getAllUserBooking, getAParticularListing } = require("../controllers/bookingHistoryController");

const router=require("express").Router();
const{checkLogin}=require("../middlewares/authMiddleware");


router.get("/test",test);
router.post("/create",checkLogin,createHistory);
router.get("/getallbookings",getAllBooking)
router.get("/getabooking/:id",getABooking)
router.get("/getaownerbooking/:ownerId",getAllOwnerBookings);
router.get("/getauserbooking/:userId",getAllUserBooking);
router.get("/getalistingbooking/:listingId",getAParticularListing);






module.exports=router;