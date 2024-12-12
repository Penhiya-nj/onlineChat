const createHttpError = require("http-errors");
const { AuthorizationMessages } = require("../messages/Auth.messages");
const jwt = require("jsonwebtoken");
const UserModel = require("../../../database/models/user.model");
require("dotenv").config();

class Authorization {
  TokenCheck = async (req, res, next) => {
    try {
      /**get access token */
      // const accessToken = req?.cookies?.access_token;
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new createHttpError.Unauthorized(AuthorizationMessages.Login);
      }
      const accessToken = authHeader.split(" ")[1];
      /**check access token */
      if (!accessToken) {
        throw new createHttpError.Unauthorized(AuthorizationMessages.Login);
      }
      /**decode access token  */
      const data = jwt.verify(accessToken, process.env.JWT_SECRETE_KEY);
      /**check  decoded data and user id in it  */
      if (typeof data === "object" && "id" in data) {
        /**return user by id in lean mode  */
        const user = await UserModel.findById(data.id, {
          accessToken: 0,
          otp: 0,
          __v: 0,
          updatedAt: 0,
          verifiedMoblie: 0,
        }).lean();
        /**check if user didnt exist  */
        if (!user)
          throw new createHttpError.Unauthorized(
            AuthorizationMessages.AccountNotFound
          );
        /**set user for request object */
        req.user = user;
        /**pass the reqest to next middleware */
        return next();
      }
      /** if there is no id in data , then :  */
      throw new createHttpError.Unauthorized(
        AuthorizationMessages.InvalidToken
      );
    } catch (error) {
      error.level = "auth";
      next(error);
    }
  };

  RoleCheck = (roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).send("Access Denied");
      }
      next();
    };
  };
}

module.exports = new Authorization();
