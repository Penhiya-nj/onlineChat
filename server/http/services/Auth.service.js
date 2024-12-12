const autoBind = require("auto-bind");
const nodemailer = require("nodemailer");
const UserModel = require("../../database/models/user.model");
const createHttpError = require("http-errors");
const { AuthMessage } = require("../common/messages/Auth.messages");
const { randomInt } = require("crypto");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt")

class AuthService {
  #UserModel;
  constructor() {
    autoBind(this);
    this.#UserModel = UserModel;
  }

  async sendOTP(email  , type , duration = 1000*60*2.5) {
    const user = await this.#UserModel.findOne({ email });

    console.log(process.env.EMAIL_ADDRESS);
    //creating otp code
    const now = new Date().getTime();
    const otp = {
      code: randomInt(100000, 999999),
      expiresIn: now + duration,
      type : type
    };

    // check if user exists
    if (!user)
      throw new createHttpError.NotFound(AuthMessage.NotFound)

    // check if user's otp expired
    if (user.otp && user.otp.expiresIn > now )
      throw new createHttpError.BadRequest(AuthMessage.OtpCodeNotExpired);

    //set the otp 
    user.otp = otp;

    //save the user in db
    await user.save();

    //send otp via email
    await this.#sendEmail(email, otp.code);


  }


  async checkOTP(email, code) {
    /** check the user with the email if exist   */
    const user = await this.CheckUserExistByEmail(email);
    /**we need this moment for check the token  */
    const now = new Date().getTime();
    /*check the token
     * if it's expired throw an exception that we caught in controller
     */
    if (user?.otp?.expiresIn < now)
      throw new createHttpError.Unauthorized(AuthMessage.OtpCodeExpired);

    if(user?.otp.type !== "login")
      throw new createHttpError.Unauthorized(AuthMessage.OtpCodeIsIncorrect);
    /*check the code against DB
     * if wrong throw an exception
     */
    if (user?.otp?.code !== code)
      throw new createHttpError.Unauthorized(AuthMessage.OtpCodeIsIncorrect);

    /*check if user email is verified */
    if (!user.isEmailVerified) {
      user.isEmailVerified = true;
    }
    
    /*generate  Access Token with internal function  @signToken   */
    const accessToken = this.signToken({ email, id: user._id });
    /*set user access token  */
    user.accessToken = accessToken;
    /*save user info  */
    await user.save();
    /*return access token to auth Controller  */
    return accessToken;
  }

  async logout(req) {
    //implement later
  }

  async #sendEmail(to, otpCode) {
    const transporter = nodemailer.createTransport({
      service: "gmail", // e.g., 'gmail' or any other service
      auth: {
        user: process.env.EMAIL_ADDRESS, // Your email
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: to,
      subject: "Your OTP Code",
      text: `Your OTP code is  \n ${otpCode} \n. It will expire in 2 minutes.`,
    };

    await transporter.sendMail(mailOptions);
  }

  async CheckUserExistByEmail(email) {
    const user = await this.#UserModel.findOne({ email });
    // console.log(user);
    if (!user) throw new createHttpError.NotFound(AuthMessage.NotFound);

    return user;
  }


  async login(email, password) {

    const user = await this.#UserModel.findOne({ email : email })

    if (!user){ 
      throw new createHttpError.NotFound(AuthMessage.NotFound)
    }
    console.log(user)
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid){
      throw new createHttpError.Unauthorized("invalid credentials ")
    }

    if (!user.isEmailVerified){
      throw new createHttpError.BadRequest("verify your email first please")
    }

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRETE_KEY,
      { expiresIn: "1h" }
    )

    return accessToken;

  }

  async register(username, email, password) {

    //develop purposes
    console.log("register " + username + " " + email + " " + password)

    //check existing username 
    const existingUsername = await this.#UserModel.findOne({ username });
    if (existingUsername) {
      throw new createHttpError.BadRequest("username already exist")
    }

    //check existing email
    const existingUserEmail = await this.#UserModel.findOne({ email });
    if (existingUserEmail) {
      throw new createHttpError.BadRequest("email already exist")
    }

    // hash password 
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("password hashed ")
    const newUser = new this.#UserModel({
      username,
      email,
      password: hashedPassword,
      isEmailVerified: false, // پیش‌فرض عدم تایید ایمیل
    });

    //save the user in database
    await newUser.save();

    // send verification link via email
    await this.sendOTP(newUser.email)

    //return user info if needed
    return newUser;


  };

  async resetPassword(newPassword ,code , email){

    const user = await this.CheckUserExistByEmail(email);
    /**we need this moment for check the token  */
    const now = new Date().getTime();
    /*check the token
     * if it's expired throw an exception that we caught in controller
     */
    if (user?.otp?.expiresIn < now)
      throw new createHttpError.Unauthorized(AuthMessage.OtpCodeExpired);


    if(user?.otp.type !== "changePassword")
      throw new createHttpError.Unauthorized(AuthMessage.OtpCodeIsIncorrect);

    /*check the code against DB
     * if wrong throw an exception
     */
    
    if (user?.otp?.code !== code)
      throw new createHttpError.Unauthorized(AuthMessage.OtpCodeIsIncorrect);

  }




  // async CheckUserExistById(id) {
  //   const user = await this.#UserModel.findOne({ _id:id });
  //   // console.log(user);
  //   if (!user) throw new createHttpError.NotFound(AuthMessage.NotFound);

  //   return user;
  // }

  async updateUser(id, data) {
    try {
      console.log(id);
      const result = await this.#UserModel.updateOne({ _id: id }, data);
      return result;
    } catch (error) {
      throw createHttpError.InternalServerError("service problem ", {
        errorlevel: "service",
      });
    }
  }

  async deleteUser(id) {
    try {
      const result = await this.#UserModel.deleteOne({ _id: id });
      return result;
    } catch (error) {
      throw createHttpError.InternalServerError("user deletion error", {
        details: error.details,
      });
    }
  }
  async getAllUsers(req) {
    try {
      let roleFilter;
      let projection = {};

      if (req.user.role === "superAdmin") {
        roleFilter = { role: { $in: ["admin", "user"] } };
        projection = {};
      } else if (req.user.role === "admin") {
        roleFilter = { role: "user" };
        projection = {
          email: 1,
          role: 1,
          mobile: 1,
          verifiedEmail: 1,
          verifiedMobile: 1,
          _id: 1,
        };
      } else {
        throw new Error("Unauthorized"); // Or handle unauthorized access appropriately
      }

      const result = await this.#UserModel.find(roleFilter, projection);
      return result; // Assuming you want to return the result
    } catch (error) {
      console.error(error); // Log the error or handle it as needed
      throw error; // Rethrow the error to handle it in the calling function or to return an error response
    }
  }

  async whoami(user) {
    try {
      console.log(user);
      const result = await this.#UserModel
        .find(
          { _id: user._id },
          { accessToken: 1, role: 1, email: 1, mobile: 1, _id: 0 }
        )
        .lean();
      console.log(result);
      return result;
    } catch (error) {
      throw error;
    }
  }
  /**generate access token with payload {mobile , userId}  */
  signToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRETE_KEY, { expiresIn: "1y" });
  }
}
module.exports = new AuthService();
