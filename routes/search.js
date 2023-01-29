const { Router } = require("express");

const { search } = require("../controllers/search");
const { validateCollection } = require("../middlewares/validate-collection");

const router = new Router();

router.get("/:collection/:filter", [validateCollection], search);

module.exports = router;
