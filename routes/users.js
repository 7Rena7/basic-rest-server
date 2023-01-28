const { Router } = require("express");
const { check } = require("express-validator");

const validateFields = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validate-JWT");
const {
  validateAdminRole,
  validateRoles,
} = require("../middlewares/validate-roles");

const {
  roleIsValid,
  emailExists,
  userIdExists,
  isPositive,
} = require("../helpers/db-validators-users");

const {
  usersGet,
  usersPut,
  usersPost,
  usersDelete,
} = require("../controllers/users");

const router = Router();

// TODO: Implement validation to check if From and Limit are positive integers
router.get(
  "/",
  [
    check("from", "Parameter 'from' should be a number").isNumeric(),
    check("from", "Parameter 'from' should be an integer").isInt(),
    // check("from", "Parameter 'from' should be positive").custom(isPositive),
    check("limit", "Parameter 'limit' should be a number").isNumeric(),
    check("limit", "Parameter 'limit' should be an integer").isInt(),
    // check("limit", "Parameter 'limit' should be positive").custom(isPositive),
    validateFields,
  ],
  usersGet
);

router.put(
  "/:id",
  [
    check("id", "ID not valid").isMongoId(),
    check("id").custom(userIdExists),
    check("role").custom(roleIsValid),
    validateFields,
  ],
  usersPut
);

router.post(
  "/",
  [
    check("name", "The name is a must").not().isEmpty(),
    check(
      "password",
      "The password is a must and must have more than 8 characters"
    ).isLength(8),
    check("email", "The email is not valid").isEmail(),
    check("email").custom(emailExists),
    check("role").custom(roleIsValid),
    validateFields,
  ],
  usersPost
);

router.delete(
  "/:id",
  [
    validateJWT,
    // validateAdminRole,
    validateRoles("ADMIN_ROLE", "COMERTIAL_ROLE"),
    check("id", "ID not valid").isMongoId(),
    check("id").custom(userIdExists),
    validateFields,
  ],
  usersDelete
);

router.get("*", (req, res) => {
  res.json({
    msg: "ERROR 404 | Page Not Found",
  });
});

module.exports = router;
