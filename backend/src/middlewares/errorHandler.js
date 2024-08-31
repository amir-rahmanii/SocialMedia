const { errorResponse } = require("../utils/response");

const errorHandler = (err, req, res, next) => {
  if (err) {
    errorResponse(res, 409, err.message);
  }
};
module.exports = errorHandler;
