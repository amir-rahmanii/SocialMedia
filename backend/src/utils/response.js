//* Helper function to format success response
const successResponse = (res, statusCode = 200, response = {}) => {
  return res.status(statusCode).json({
    status: statusCode,
    success: true,
    response,
  });
};
//* Helper function to format error response

const errorResponse = (res, statusCode = 409, error = {}) => {
  return res
    .status(statusCode)
    .json({ status: statusCode, success: false, error });
};
//* move to catch block
const throwError = (errorMessage, statusCode) => {
  let error = new Error(errorMessage);
  error.statusCode = statusCode;
  throw error;
};
module.exports = { successResponse, errorResponse, throwError };
