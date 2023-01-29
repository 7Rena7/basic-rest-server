const { Router } = require("express");
const { check } = require("express-validator");

const {
  validateFields,
  validateJWT,
  validateFileUpload,
  validateCollection,
  validateExistsInCollection,
} = require("../middlewares");

const {
  uploadFile,
  uploadFileById,
  getImageById,
  uploadFileByIdCloudinary,
} = require("../controllers/uploads");

const router = new Router();

router.post("/", [validateJWT, validateFileUpload], uploadFile);

router.put(
  "/:collection/:id",
  [
    validateJWT,
    validateFileUpload,
    validateCollection,
    check("id", "ID not valid").isMongoId(),
    validateExistsInCollection,
    validateFields,
  ],
  // uploadFileById
  uploadFileByIdCloudinary
);

router.get(
  "/:collection/:id",
  [
    validateJWT,
    validateCollection,
    check("id", "ID not valid").isMongoId(),
    validateExistsInCollection,
    validateFields,
  ],
  getImageById
);

module.exports = router;
