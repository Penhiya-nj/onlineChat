const AuthMessage = {
  sentOTPSuccessfully: "sent OTP successfully",
  NotFound: "user not found",
  OtpCodeNotExpired: "otp code is Not expired, yet please try later",
  OtpCodeExpired: "otp code has been expired, please try again",
  OtpCodeIsIncorrect: "otp code is incorrect",
  LoginSuccessfully: "You're logged In! YAY!",
  logOutSuccessfully: "You logged out successfully",
};
const AuthorizationMessages = Object.freeze({
  Login: "please login to your account",
  LoginAgain: "please login again",
  UnAuthorized: "unauthorized please login in your account",
  AccountNotFound: "account not found",
  InvalidToken: "Invalid Token ",
});

module.exports = { AuthMessage, AuthorizationMessages };
