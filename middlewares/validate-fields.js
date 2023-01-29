const { request, response } = require("express");
const { validationResult } = require("express-validator");

const validateFields = (req = request, res = response, next) => {
  const middlewaresErrors = validationResult(req);

  if (!middlewaresErrors.isEmpty()) {
    return res.status(400).json(middlewaresErrors);
  }

  next();
};

module.exports = { validateFields };
