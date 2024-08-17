const jwt = require("jsonwebtoken");

exports.accessTokenCreator = (user, expireTime) => {
  const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: expireTime,
  });
  return accessToken;
};
exports.accessTokenExpiredTimeValidator = (authorizationHeader) => {
  let accessToken = authorizationHeader.split(" ")[1];
  const decodedPayloadJwt = jwt.verify(accessToken, process.env.JWT_SECRET);
  return decodedPayloadJwt;
};
