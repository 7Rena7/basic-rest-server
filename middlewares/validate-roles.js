const { request, response } = require("express");

const validateAdminRole = (req = request, res = response, next) => {
  if (!req.authenticatedUser) {
    return res.status(500).json({
      msg: "The user role is being validated before checking the JWT",
    });
  }

  const { role } = req.authenticatedUser;
  const adminRole = "ADMIN_ROLE";

  if (role.toUpperCase() !== adminRole) {
    res.status(401).json({
      msg: `User is not Admin`,
      additionalMsg: `User Role: ${role}`,
    });
  }

  next();
};

const validateRoles = (...roles) => {
  return (req = request, res = response, next) => {
    if (!req.authenticatedUser) {
      return res.status(500).json({
        msg: "The user role is being validated before checking the JWT",
      });
    }

    const { role: userRole } = req.authenticatedUser;

    if (!roles.includes(userRole.toUpperCase())) {
      res.status(401).json({
        msg: `User is not included in the necessary roles to do this action`,
        additionalMsg: `User Role: ${userRole}. Needed roles: ${roles.join(
          ", "
        )}`,
      });
    }

    next();
  };
};

module.exports = {
  validateAdminRole,
  validateRoles,
};
