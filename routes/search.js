const { Router } = require("express");
const { check } = require("express-validator");

const { search } = require("../controllers/search");

const router = new Router();

router.get("/:collection/:filter", search);

module.exports = router;
