const matchService = require("../services/matchService");

class MatchController {
  async findMatchesForLostItem(req, res, next) {
    try {
      const { minScore = 40 } = req.query;

      const result = await matchService.findMatchesForLostItem(
        req.params.id,
        parseInt(minScore)
      );

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async findMatchesForFoundItem(req, res, next) {
    try {
      const { minScore = 40 } = req.query;

      const result = await matchService.findMatchesForFoundItem(
        req.params.id,
        parseInt(minScore)
      );

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllMatches(req, res, next) {
    try {
      const { minScore = 40, limit = 50 } = req.query;

      const result = await matchService.getAllMatches(
        parseInt(minScore),
        parseInt(limit)
      );

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyLostItemMatches(req, res, next) {
    try {
      const { minScore = 40 } = req.query;

      const result = await matchService.getMyLostItemMatches(
        req.user._id,
        parseInt(minScore)
      );

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyFoundItemMatches(req, res, next) {
    try {
      const { minScore = 40 } = req.query;

      const result = await matchService.getMyFoundItemMatches(
        req.user._id,
        parseInt(minScore)
      );

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MatchController();
