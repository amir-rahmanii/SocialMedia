const jwt = require("jsonwebtoken");

exports.accessTokenCreator = (user, expireTime) => {
  const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: expireTime,
  });
  return accessToken;
};
exports.accessTokenExpiredTimeValidator = (authorizationHeader) => {
  try {
    const token = authorizationHeader.split(' ')[1];
    return jwt.verify(token, process.env.JWT_SECRET); // Adjust according to your setup
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      error.statusCode = 409; // Set status code for expired token
    }
    throw error; // Re-throw the error to be handled in the catch block
  }
};
