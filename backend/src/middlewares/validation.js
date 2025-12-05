const { body, param, query, validationResult } = require("express-validator");

const CATEGORIES = [
  "Electronics",
  "Documents",
  "Keys",
  "Bags",
  "Wallets",
  "Jewelry",
  "Clothing",
  "Pets",
  "Other",
];

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

const dateNotInFuture = (value) => {
  if (value && new Date(value) > new Date()) {
    throw new Error("Date cannot be in the future");
  }
  return true;
};

const userValidation = {
  create: [
    body("uid").notEmpty().withMessage("Firebase UID is required"),
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters"),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please provide a valid email"),
    body("phone")
      .optional()
      .matches(/^\+?[\d\s-()]+$/)
      .withMessage("Please provide a valid phone number"),
    body("bio")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Bio cannot exceed 500 characters"),
    handleValidation,
  ],
  update: [
    body("name")
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters"),
    body("phone")
      .optional()
      .matches(/^\+?[\d\s-()]+$/)
      .withMessage("Please provide a valid phone number"),
    body("profilePic")
      .optional()
      .isURL()
      .withMessage("Profile picture must be a valid URL"),
    body("bio")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Bio cannot exceed 500 characters"),
    handleValidation,
  ],
};

const baseItemCreateValidation = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(CATEGORIES)
    .withMessage("Invalid category"),
  body("location").notEmpty().withMessage("Location is required"),
  body("imageUrl").optional().isURL().withMessage("Image URL must be valid"),
];

const baseItemUpdateValidation = [
  body("title")
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),
  body("description")
    .optional()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),
  body("category").optional().isIn(CATEGORIES).withMessage("Invalid category"),
  body("location")
    .optional()
    .notEmpty()
    .withMessage("Location cannot be empty"),
  body("status")
    .optional()
    .isIn(["active", "resolved"])
    .withMessage("Status must be either active or resolved"),
  body("imageUrl").optional().isURL().withMessage("Image URL must be valid"),
];

const itemValidation = {
  lost: {
    create: [
      ...baseItemCreateValidation,
      body("dateLost")
        .notEmpty()
        .withMessage("Date lost is required")
        .isISO8601()
        .withMessage("Date must be in valid format")
        .custom(dateNotInFuture),
      handleValidation,
    ],
    update: [
      ...baseItemUpdateValidation,
      body("dateLost")
        .optional()
        .isISO8601()
        .withMessage("Date must be in valid format")
        .custom(dateNotInFuture),
      handleValidation,
    ],
  },
  found: {
    create: [
      ...baseItemCreateValidation,
      body("dateFound")
        .notEmpty()
        .withMessage("Date found is required")
        .isISO8601()
        .withMessage("Date must be in valid format")
        .custom(dateNotInFuture),
      handleValidation,
    ],
    update: [
      ...baseItemUpdateValidation,
      body("dateFound")
        .optional()
        .isISO8601()
        .withMessage("Date must be in valid format")
        .custom(dateNotInFuture),
      handleValidation,
    ],
  },
};

const lostItemValidation = itemValidation.lost;
const foundItemValidation = itemValidation.found;

const validateId = [
  param("id").isMongoId().withMessage("Invalid ID format"),
  handleValidation,
];

const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  handleValidation,
];

module.exports = {
  userValidation,
  itemValidation,
  lostItemValidation,
  foundItemValidation,
  validateId,
  validatePagination,
  handleValidation,
  CATEGORIES,
};
