const CustomError = require("../utils/customError");

const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'user']. req.user.role = 'user'
    if (!roles.includes(req.user.role)) {
      return next(
        new CustomError(
          "You do not have permission to perform this action",
          403
        )
      );
    }

    next();
  };
};

module.exports = restrictTo;
