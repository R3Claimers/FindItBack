const Report = require("../models/Report");
const { LostItem, FoundItem } = require("../models/Item");

exports.createReport = async (req, res, next) => {
  try {
    const { itemType, itemId, reason, details } = req.body;

    const Model = itemType === "LostItem" ? LostItem : FoundItem;
    const item = await Model.findById(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    const existingReport = await Report.findOne({
      reportedBy: req.user._id,
      itemId,
    });

    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: "You have already reported this item",
      });
    }

    const report = await Report.create({
      reportedBy: req.user._id,
      itemType,
      itemId,
      reason,
      details,
    });

    res.status(201).json({
      success: true,
      message: "Report submitted successfully. We'll review it shortly.",
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

exports.getReportsByItem = async (req, res, next) => {
  try {
    const { itemType, itemId } = req.params;

    const reports = await Report.find({ itemType, itemId })
      .populate("reportedBy", "name email")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllReports = async (req, res, next) => {
  try {
    const { status, itemType } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (itemType) filter.itemType = itemType;

    const reports = await Report.find(filter)
      .populate("reportedBy", "name email")
      .populate("itemId")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateReportStatus = async (req, res, next) => {
  try {
    const { reportId } = req.params;
    const { status, adminNotes } = req.body;

    const report = await Report.findByIdAndUpdate(
      reportId,
      {
        status,
        adminNotes,
        reviewedBy: req.user._id,
        reviewedAt: Date.now(),
      },
      { new: true, runValidators: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Report status updated successfully",
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteReport = async (req, res, next) => {
  try {
    const { reportId } = req.params;

    const report = await Report.findByIdAndDelete(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
