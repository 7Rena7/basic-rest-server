const validateCollection = require("./validate-collection");
const validateExistsInCollection = require("./validate-exists-in-collection");
const validateFields = require("./validate-fields");
const validateFileUpload = require("./validate-file-upload");
const validateJWT = require("./validate-JWT");
const validateRoles = require("./validate-roles");

module.exports = {
  ...validateCollection,
  ...validateExistsInCollection,
  ...validateFields,
  ...validateFileUpload,
  ...validateJWT,
  ...validateRoles,
};
