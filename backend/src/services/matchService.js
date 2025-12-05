const itemService = require("./itemService");
const {
  findMatchesForLostItem,
  findMatchesForFoundItem,
  getAllMatches,
} = require("../utils/matchingAlgorithm");

class MatchService {
  async findMatchesForLostItem(lostItemId, minScore = 40) {
    const lostItem = await itemService.getItemById("lost", lostItemId);

    if (!lostItem) {
      throw new Error("Lost item not found");
    }

    if (lostItem.status !== "open") {
      throw new Error("This lost item has already been resolved");
    }

    const foundItemsResult = await itemService.getActiveItems("found");
    const matches = findMatchesForLostItem(
      lostItem,
      foundItemsResult,
      minScore
    );

    return {
      lostItem,
      matches,
      totalMatches: matches.length,
    };
  }

  async findMatchesForFoundItem(foundItemId, minScore = 40) {
    const foundItem = await itemService.getItemById("found", foundItemId);

    if (!foundItem) {
      throw new Error("Found item not found");
    }

    if (foundItem.status !== "available") {
      throw new Error("This found item has already been returned");
    }

    const lostItemsResult = await itemService.getActiveItems("lost");
    const matches = findMatchesForFoundItem(
      foundItem,
      lostItemsResult,
      minScore
    );

    return {
      foundItem,
      matches,
      totalMatches: matches.length,
    };
  }

  async getAllMatches(minScore = 40, limit = 50) {
    const [lostItems, foundItems] = await Promise.all([
      itemService.getActiveItems("lost"),
      itemService.getActiveItems("found"),
    ]);

    let matches = getAllMatches(lostItems, foundItems, minScore);

    if (limit && matches.length > limit) {
      matches = matches.slice(0, limit);
    }

    return {
      matches,
      totalMatches: matches.length,
      totalLostItems: lostItems.length,
      totalFoundItems: foundItems.length,
    };
  }

  async getMyLostItemMatches(userId, minScore = 40) {
    const userLostItems = await itemService.getUserItems(
      "lost",
      userId,
      1,
      100
    );
    const openLostItems = userLostItems.items.filter(
      (item) => item.status === "open"
    );

    if (openLostItems.length === 0) {
      return {
        matches: [],
        totalMatches: 0,
      };
    }

    const foundItems = await itemService.getActiveItems("found");

    const allMatches = [];
    for (const lostItem of openLostItems) {
      const matches = findMatchesForLostItem(lostItem, foundItems, minScore);
      if (matches.length > 0) {
        allMatches.push({
          lostItem,
          matches,
        });
      }
    }

    return {
      matches: allMatches,
      totalMatches: allMatches.reduce(
        (sum, item) => sum + item.matches.length,
        0
      ),
    };
  }

  async getMyFoundItemMatches(userId, minScore = 40) {
    const userFoundItems = await itemService.getUserItems(
      "found",
      userId,
      1,
      100
    );
    const availableFoundItems = userFoundItems.items.filter(
      (item) => item.status === "available"
    );

    if (availableFoundItems.length === 0) {
      return {
        matches: [],
        totalMatches: 0,
      };
    }

    const lostItems = await itemService.getActiveItems("lost");

    const allMatches = [];
    for (const foundItem of availableFoundItems) {
      const matches = findMatchesForFoundItem(foundItem, lostItems, minScore);
      if (matches.length > 0) {
        allMatches.push({
          foundItem,
          matches,
        });
      }
    }

    return {
      matches: allMatches,
      totalMatches: allMatches.reduce(
        (sum, item) => sum + item.matches.length,
        0
      ),
    };
  }
}

module.exports = new MatchService();
