const express = require("express");
const router = express.Router();
const claimController = require("../controllers/claimController");
const authenticateUser = require("../middlewares/auth");

router.use(authenticateUser);

// Create a new claim
router.post("/", claimController.createClaim);

// Get current user's claims
router.get("/my-claims", claimController.getUserClaims);

// Check if user has claimed a specific item
router.get("/status/:itemId", claimController.getClaimStatus);

// Get all claims for an item (owner only)
router.get("/item/:itemId", claimController.getItemClaims);

// Approve a claim (owner only)
router.put("/:id/approve", claimController.approveClaim);

// Reject a claim (owner only)
router.put("/:id/reject", claimController.rejectClaim);

// Delete/withdraw a claim (claimant only)
router.delete("/:id", claimController.deleteClaim);

module.exports = router;
