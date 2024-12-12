const { Router } = require("express");
const AuthController = require("../controllers/Auth.controller");
const Authorization = require("../common/guard/Authorization.guard");
const AuthValidator = require("../middlewares/auth.validate");
const router = Router();

router.post("/login", AuthController.login);

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
router.get('/change-password', Authorization.TokenCheck ,AuthController.changePassword);

// Reset password with token
router.post('/reset-password/:token', AuthController.resetPassword);

//set the middleware for token check 
//router.use(Authorization.TokenCheck);

router.get("/whoami", AuthController.whoami)

// Refresh access token
router.post('/refresh-token', AuthController.refreshToken);

// Logout user
router.post('/logout', AuthController.logout);



//router.patch("/user/:id" , Authorization.TokenCheck ,Authorization.RoleCheck(['superAdmin']),AuthValidator.ValidateUpdateUser, AuthController.updateUser)
//router.delete("/user/: ", Authorization.TokenCheck ,Authorization.RoleCheck(['superAdmin']), AuthController.deleteUser)
//router.get("/user", Authorization.TokenCheck ,Authorization.RoleCheck(['superAdmin' , "admin"]), AuthController.AllUsers)
//router.get("/logout",  Authorization.TokenCheck,AuthController.logOut);


module.exports = { AuthRouter: router }
