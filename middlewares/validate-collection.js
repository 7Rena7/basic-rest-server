const { request, response } = require("express");

const validateCollection = (req = request, res = response, next) => {
  const availableCollections = ["categories", "products", "roles", "users"];

  const { collection } = req.params;

  if (!availableCollections.includes(collection)) {
    return res.status(400).json({
      msg: "Collection not available, please check the entered collection name.",
      additionalMsg: `Available collections: ${availableCollections.join(
        ", "
      )}`,
    });
  }

  next();
};

module.exports = {
  validateCollection,
};
