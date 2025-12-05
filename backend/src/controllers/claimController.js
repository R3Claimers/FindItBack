const Claim = require("../models/Claim");
const { FoundItem } = require("../models/Item");

class ClaimController {
  async createClaim(req, res, next) {
    try {
      const { itemId, message } = req.body;

      const item = await FoundItem.findById(itemId);
      if (!item) {
        return res.status(404).json({
          status: "error",
          message: "Found item not found",
        });
      }

      // Prevent owner from claiming their own item
      if (item.userId.toString() === req.user._id.toString()) {
        return res.status(400).json({
          status: "error",
          message: "You cannot claim your own item",
        });
      }

      // Check if item is already returned
      if (item.isReturned) {
        return res.status(400).json({
          status: "error",
          message: "This item has already been returned",
        });
      }

      // Check if user already has a claim on this item
      const existingClaim = await Claim.findOne({
        itemId,
        claimantId: req.user._id,
      });

      if (existingClaim) {
        return res.status(400).json({
          status: "error",
          message: "You have already submitted a claim for this item",
        });
      }

      const claim = await Claim.create({
        itemId,
        claimantId: req.user._id,
        message,
      });

      await claim.populate("claimantId", "name email profilePic");

      res.status(201).json({
        status: "success",
        message: "Claim submitted successfully",
        data: claim,
      });
    } catch (error) {
      next(error);
    }
  }

  async getItemClaims(req, res, next) {
    try {
      const { itemId } = req.params;

      const item = await FoundItem.findById(itemId);
      if (!item) {
        return res.status(404).json({
          status: "error",
          message: "Found item not found",
        });
      }

      // Only item owner can view all claims
      if (item.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          status: "error",
          message: "Only the item owner can view claims",
        });
      }

      const claims = await Claim.find({ itemId })
        .populate("claimantId", "name email phone profilePic")
        .sort({ createdAt: -1 });

      res.status(200).json({
        status: "success",
        data: claims,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserClaims(req, res, next) {
    try {
      const claims = await Claim.find({ claimantId: req.user._id })
        .populate({
          path: "itemId",
          select: "title category location images imageUrl isReturned",
          populate: { path: "userId", select: "name email" },
        })
        .sort({ createdAt: -1 });

      res.status(200).json({
        status: "success",
        data: claims,
      });
    } catch (error) {
      next(error);
    }
  }

  async approveClaim(req, res, next) {
    try {
      const { id } = req.params;
      const { responseMessage } = req.body;

      const claim = await Claim.findById(id);
      if (!claim) {
        return res.status(404).json({
          status: "error",
          message: "Claim not found",
        });
      }

      const item = await FoundItem.findById(claim.itemId);
      if (!item) {
        return res.status(404).json({
          status: "error",
          message: "Associated item not found",
        });
      }

      // Only item owner can approve claims
      if (item.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          status: "error",
          message: "Only the item owner can approve claims",
        });
      }

      if (claim.status !== "pending") {
        return res.status(400).json({
          status: "error",
          message: "This claim has already been processed",
        });
      }

      // Approve this claim
      claim.status = "approved";
      claim.responseMessage = responseMessage;
      claim.respondedAt = new Date();
      await claim.save();

      // Reject all other pending claims for the same item
      await Claim.updateMany(
        { itemId: claim.itemId, _id: { $ne: id }, status: "pending" },
        {
          status: "rejected",
          responseMessage: "Another claim was approved",
          respondedAt: new Date(),
        }
      );

      // Update item status to claimed
      item.status = "claimed";
      await item.save();

      await claim.populate("claimantId", "name email phone profilePic");

      res.status(200).json({
        status: "success",
        message: "Claim approved successfully",
        data: claim,
      });
    } catch (error) {
      next(error);
    }
  }

  async rejectClaim(req, res, next) {
    try {
      const { id } = req.params;
      const { responseMessage } = req.body;

      const claim = await Claim.findById(id);
      if (!claim) {
        return res.status(404).json({
          status: "error",
          message: "Claim not found",
        });
      }

      const item = await FoundItem.findById(claim.itemId);
      if (!item) {
        return res.status(404).json({
          status: "error",
          message: "Associated item not found",
        });
      }

      // Only item owner can reject claims
      if (item.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          status: "error",
          message: "Only the item owner can reject claims",
        });
      }

      if (claim.status !== "pending") {
        return res.status(400).json({
          status: "error",
          message: "This claim has already been processed",
        });
      }

      claim.status = "rejected";
      claim.responseMessage = responseMessage;
      claim.respondedAt = new Date();
      await claim.save();

      await claim.populate("claimantId", "name email profilePic");

      res.status(200).json({
        status: "success",
        message: "Claim rejected",
        data: claim,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteClaim(req, res, next) {
    try {
      const { id } = req.params;

      const claim = await Claim.findById(id);
      if (!claim) {
        return res.status(404).json({
          status: "error",
          message: "Claim not found",
        });
      }

      // Only claimant can delete their own pending claim
      if (claim.claimantId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          status: "error",
          message: "You can only delete your own claims",
        });
      }

      if (claim.status !== "pending") {
        return res.status(400).json({
          status: "error",
          message: "Only pending claims can be withdrawn",
        });
      }

      await claim.deleteOne();

      res.status(200).json({
        status: "success",
        message: "Claim withdrawn successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getClaimStatus(req, res, next) {
    try {
      const { itemId } = req.params;

      const claim = await Claim.findOne({
        itemId,
        claimantId: req.user._id,
      });

      res.status(200).json({
        status: "success",
        data: claim,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ClaimController();
