const { Router } = require("express");
const AuthController = require("../controllers/Auth.controller");
const Authorization = require("../common/guard/Authorization.guard");
const AuthValidator = require("../middlewares/auth.validate");
const rateLimit = require('express-rate-limit');
const router = Router();

const loginRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5, 
    message: {
        status: 429,
        message: 'Too many login attempts from this IP, please try again after 15 minutes.',
    },
});
router.post("/login", loginRateLimiter, AuthController.login);

router.post("/send-otp", AuthController.sendOTP);
router.post("/check-otp", AuthController.checkOTP);


// Register a new user
router.post('/register', AuthValidator.register, AuthController.register);

// Login user with username and password 


// // Request OTP for two-step verification
// router.post('/request-otp', AuthController.requestOtp);

// // Verify OTP code
// router.post('/verify-otp', AuthController.verifyOtp);

// Forgot password (send reset link)
router.get('/change-password', Authorization.TokenCheck, AuthController.changePassword);

// Reset password with token
router.post('/reset-password', Authorization.TokenCheck, AuthController.resetPassword);

//set the middleware for token check 
//router.use(Authorization.TokenCheck);

router.get("/whoami", Authorization.TokenCheck, AuthController.whoami)

// Refresh access token
router.post('/refresh-token', AuthController.refreshToken);

// Logout user
router.get('/logout', Authorization.TokenCheck, AuthController.logout);



//router.patch("/user/:id" , Authorization.TokenCheck ,Authorization.RoleCheck(['superAdmin']),AuthValidator.ValidateUpdateUser, AuthController.updateUser)
//router.delete("/user/: ", Authorization.TokenCheck ,Authorization.RoleCheck(['superAdmin']), AuthController.deleteUser)
//router.get("/user", Authorization.TokenCheck ,Authorization.RoleCheck(['superAdmin' , "admin"]), AuthController.AllUsers)
//router.get("/logout",  Authorization.TokenCheck,AuthController.logOut);


module.exports = { AuthRouter: router }
