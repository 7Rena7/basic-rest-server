const dbValidatorsCategories = require("./db-validators-categories");
const dbValidatorsProducts = require("./db-validators-products");
const dbValidatorsUsers = require("./db-validators-users");
const generateJWT = require("./generateJWT");
const googleVerify = require("./google-verify");
const uploadFile = require("./upload-file");

module.exports = {
  ...dbValidatorsCategories,
  ...dbValidatorsProducts,
  ...dbValidatorsUsers,
  ...generateJWT,
  ...googleVerify,
  ...uploadFile,
};
