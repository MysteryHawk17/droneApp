const { test, register, loginUser } = require("../controllers/authController");

const router=require("express").Router();


router.get("/test",test);
router.post("/register",register);
router.post("/login",loginUser);




module.exports=router;