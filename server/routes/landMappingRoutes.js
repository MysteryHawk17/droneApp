const { test, createProposal, getAllProposal, getParticularProposalAdmin, getParticularProposalOwner, updateProposal, deleteProposal, bidToProposal, retractBid, removeBid, assignWinner, assignedProposals, updateBidStatus } = require("../controllers/landMappingController");

const router = require("express").Router();

const { checkLogin } = require('../middlewares/authMiddleware');


router.get("/test", test);
router.post("/create", createProposal);
router.get("/getallproposals", getAllProposal);
router.get("/getaproposal/admin/:id", getParticularProposalAdmin);
router.get("/getaproposal/owner/:id", getParticularProposalOwner);
router.put("/updateproposal/:id", updateProposal);
router.put("/updatebidstatus/:id", updateBidStatus);
router.delete("/deleteproposal/:id", deleteProposal);
router.put("/bidtoproposal/:proposalId", checkLogin, bidToProposal);
router.put("/retractbid/owner/:proposalId", checkLogin, retractBid);
router.put("/removebid/admin/:proposalId", removeBid);
router.post("/assignwinner/:proposalId", assignWinner)
router.get("/getassignedproposals/:ownerId", assignedProposals);



module.exports = router;