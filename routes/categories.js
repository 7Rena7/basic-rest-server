const { Router } = require("express");
const { check } = require("express-validator");

const validateFields = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validate-JWT");
const { validateRoles } = require("../middlewares/validate-roles");

const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategoryById,
  deleteCategory,
} = require("../controllers/categories");

const {
  categoryExists,
  categoryIdExists,
} = require("../helpers/db-validators-categories");

const router = Router();

// Get all categories - public
router.get(
  "/",
  [
    check("from", "Parameter 'from' should be a number").isNumeric(),
    check("from", "Parameter 'from' should be an integer").isInt(),
    check("limit", "Parameter 'limit' should be a number").isNumeric(),
    check("limit", "Parameter 'limit' should be an integer").isInt(),
    validateFields,
  ],
  getCategories
);

// Get one category by id - public
router.get(
  "/:id",
  [
    check("id", "ID not valid").isMongoId(),
    check("id").custom(categoryIdExists),
    validateFields,
  ],
  getCategoryById
);

// Create category - private - whoever with a valid token
router.post(
  "/",
  [
    validateJWT,
    check("name", "Name is required").not().isEmpty(),
    validateRoles("ADMIN_ROLE"),
    check("name").custom(categoryExists),
    validateFields,
  ],
  createCategory
);

// Update category by id - private - whoever with a valid token
router.put(
  "/:id",
  [
    validateJWT,
    check("id", "ID not valid").isMongoId(),
    check("id").custom(categoryIdExists),
    check("name", "Name is required").not().isEmpty(),
    validateFields,
  ],
  updateCategoryById
);

// Delete category by id - private - only ADMIN users with a valid token
router.delete(
  "/:id",
  [
    validateJWT,
    validateRoles("ADMIN_ROLE"),
    check("id", "ID not valid").isMongoId(),
    check("id").custom(categoryIdExists),
    validateFields,
  ],
  deleteCategory
);

router.get("*", (req, res) => {
  res.json({
    msg: "ERROR 404 | Page Not Found",
  });
});

module.exports = router;
