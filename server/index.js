const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const connectDB = require('./db/connect');
require('dotenv').config();

//routes imports
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const listingRoutes = require("./routes/droneListingRoutes");
const historyRoutes = require("./routes/bookingHistoryRoutes");
const userRoutes = require("./routes/userRoutes");
const proposalRoutes=require("./routes/landMappingRoutes");
//middlewares
app.use(express.json({ limit: "50mb" }));
app.use(cors());

//route middlewares
app.use("/api/admin", adminRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/listing", listingRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/user", userRoutes);
app.use("/api/proposal",proposalRoutes);
//server test route
app.get("/", (req, res) => {
    res.status(200).json({ message: "Drone server is running" })

})
//connection to database
connectDB(process.env.MONGO_URI);

//server listenng 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

