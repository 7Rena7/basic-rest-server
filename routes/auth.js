const { Router } = require("express");
const { check } = require("express-validator");

const { login } = require("../controllers/auth");
const validateFields = require("../middlewares/validate-fields");

const router = Router();

router.post(
  "/login",
  [
    check("email", "Email is a must").isEmail(),
    check("password", "Password is a must").not().isEmpty(),
    validateFields,
  ],
  login
);

module.exports = router;
