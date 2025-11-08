const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateUser = require("../middlewares/auth");
const { userValidation, validateId } = require("../middlewares/validation");

// Public routes (no authentication required)
router.post("/", userValidation.create, userController.createOrUpdateUser);

// Protected routes (authentication required)
router.use(authenticateUser);

router.get("/me", userController.getCurrentUser);
router.put("/me", userValidation.update, userController.updateCurrentUser);
router.post("/change-password", userController.changePassword);
router.delete("/me", userController.deleteCurrentUser);
router.get("/:id", validateId, userController.getUserById);

module.exports = router;
