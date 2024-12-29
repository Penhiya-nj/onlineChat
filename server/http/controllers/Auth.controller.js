// const Cookie = require("../../common/constant/cookie.enum");
// const NodeEnv = require("../../common/constant/env.enum");
const createHttpError = require("http-errors");
const { AuthMessage } = require("../common/messages/Auth.messages");
const AuthService = require("../services/Auth.service");
const autoBind = require("auto-bind");
class AuthController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = AuthService;
  }

  async sendOTP(req, res, next) {
    try {
      const { email } = req.body;
      await this.#service.sendOTP(email, "login", 1000 * 2.5 * 60);
      return res.json({
        message: AuthMessage.sentOTPSuccessfully,
      });
    } catch (error) {
      next(error);
    }
  }

  async checkOTP(req, res, next) {
    try {
      const { email, code } = req.body;
      const accessToken = await this.#service.checkOTP(email, code);

      return res.status(200).json({
        message: AuthMessage.LoginSuccessfully,
        token: accessToken,
      });
      // .cookie(Cookie.AccessToken , accessToken, {
      //   httpOnly: true,
      //   secure: false,
      // })
    } catch (error) {
      next(error);
    }
  }

  async whoami(req, res, next) {
    try {

      const user = await this.#service.whoami(req.user);
      res.status(200).json({
        statusCode: 200,
        message: "your info ",
        data: user,
      });
    } catch (error) {
      let err = error;
      err.errorLevel = error.errorLevel || "authController";
      next(err);
    }
  }

  async register(req, res, next) {
    try {
      const { username, email, password } = req.body;
      const newUser = await this.#service.register(username, email, password);
      return res.status(201).json({
        message: "User registered successfully. please check your email",
        // user: {
        //   id: newUser._id,
        //   username: newUser.username,
        //   email: newUser.email,
        //   isEmailVerified: newUser.isEmailVerified,
        //   role: newUser.role,
        // },
      });
    }
    catch (error) {
      next(error);
    }

  }




  async login(req, res, next) {
    try {
      const { email, password } = req.body

      const accessToken = await this.#service.login(email, password)
      
      return res.status(200).json({
        accessToken,
        message: "copy and save your access token \n"
          + "WARNING : whoever have this access token can access your account be careful about it "
      })
    } catch (err) {
      next(err);
    }

  }





  async changePassword(req, res, next) {
    try {
      const user = req.user
      await this.#service.sendOTP(user.email, "changePassword", 1000 * 60 * 2.5)
      res.send("please check your email and use the code to  change your password")
    } catch (err) {
      next(err)
    }
  }

  async resetPassword(req, res, next) {
    try {
      if (req.user.email !== req.body.email)
        throw new createHttpError.BadRequest("please use your registered email")

      const { password, otp } = req.body

      await this.#service.resetPassword(password, otp, req.user.email)
      await this.#service.logout(req.user.accessToken)
      res.send("your password changed , please login with new password")
    }
    catch (err) {
      next(err)
    }
  }

  async refreshToken(req, res, next) {

    next();
  }

  async logout(req, res, next) {
    try {
      await this.#service.logout(req.user.accessToken)
      res.send("you logged out :  " + new Date())
    }
    catch (error) {
      next(error)
    }
  } 
  // async updateUser(req, res, next) {
  //   let err;
  //   try {
  //     const { id: userId } = req.params;
  //     const result = await this.#service.updateUser(userId, req.body);
  //     res.status(200).json({
  //       statuscode: 200,
  //       data: {
  //         result,
  //         message: "edited",
  //       },
  //     });
  //   } catch (error) {
  //     err = error;
  //     err.errorLevel = error.errorLevel || "authController";
  //     next(err);
  //   }
  // }

  // async deleteUser(req, res, next) {
  //   try {
  //     const { id } = req.params;
  //     const result = await this.#service.deleteUser(id);
  //     res.status(204).json({
  //       statusCode: 204,
  //       message: "successfuly deleted",
  //       data: [result],
  //     });
  //   } catch (error) {
  //     err = error;
  //     err.errorLevel = error.errorLevel || "authController";
  //     next(err);
  //   }
  // }

  // async AllUsers(req, res, next) {
  //   let err;
  //   try {
  //     const result = await this.#service.getAllUsers(req);
  //     return res.status(200).json({
  //       statusCode: 200,
  //       data: result,
  //     });
  //   } catch (error) {
  //     err = error;
  //     err.errorLevel = error.errorLevel || "authController";
  //     next(err);
  //   }
  // }

  // async logOut(req, res, next) {
  //   return res.send("you dont need to logout");
  // }
}
module.exports = new AuthController();
