const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields } = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validate-JWT");
const { validateRoles } = require("../middlewares/validate-roles");

const {
  productExists,
  productIdExists,
} = require("../helpers/db-validators-products");

const { categoryIdExists } = require("../helpers/db-validators-categories");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProduct,
} = require("../controllers/products");

const router = Router();

// Get all products - public
router.get(
  "/",
  [
    check("from", "Parameter 'from' should be a number").isNumeric(),
    check("from", "Parameter 'from' should be an integer").isInt(),
    check("limit", "Parameter 'limit' should be a number").isNumeric(),
    check("limit", "Parameter 'limit' should be an integer").isInt(),
    validateFields,
  ],
  getProducts
);

// Get one product by id - public
router.get(
  "/:id",
  [
    check("id", "ID not valid").isMongoId(),
    check("id").custom(productIdExists),
    validateFields,
  ],
  getProductById
);

// Create product - private - whoever with a valid token
router.post(
  "/",
  [
    validateJWT,
    check("name", "Name is required").not().isEmpty(),
    check("category", "Category must be a valid Id").isMongoId(),
    check("name").custom(productExists),
    check("category").custom(categoryIdExists),
    validateFields,
  ],
  createProduct
);

// Update product by id - private - whoever with a valid token
router.put(
  "/:id",
  [
    validateJWT,
    check("id", "ID not valid").isMongoId(),
    check("id").custom(productIdExists),
    validateFields,
  ],
  updateProductById
);

// Delete product by id - private - only ADMIN users with a valid token
router.delete(
  "/:id",
  [
    validateJWT,
    validateRoles("ADMIN_ROLE"),
    check("id", "ID not valid").isMongoId(),
    check("id").custom(productIdExists),
    validateFields,
  ],
  deleteProduct
);

router.get("*", (req, res) => {
  res.json({
    msg: "ERROR 404 | Page Not Found",
  });
});

module.exports = router;
