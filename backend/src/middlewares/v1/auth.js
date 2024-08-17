const { accessTokenExpiredTimeValidator } = require("../../utils/jwtCreator");
const { errorResponse } = require("../../utils/response");
const userModel = require("../../models/v1/user");
module.exports = async (req, res, next) => {
  try {
    let accessToken = req.headers.authorization;
    if (!accessToken) {
      return errorResponse(res, 401, "please add token in headers");
    }
    let accessTokenData = accessTokenExpiredTimeValidator(accessToken);
    const user = await userModel.findOne({ _id: accessTokenData.userId });
    if (!user) {
      return errorResponse(res, 404, "olease fitst login");
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
