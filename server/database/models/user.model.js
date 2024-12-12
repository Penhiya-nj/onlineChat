const { Schema, model } = require("mongoose");

const OTPSchema = new Schema({
  code: { type: String, required: false, default: undefined },
  expiresIn: { type: Number, required: false, default: 0 },
  type: {type : String , required : true , default : 1000*60*2.5}
});
const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: false },
    otp: { type: OTPSchema },
    accessToken: { type: String },
    role: { type: String, enum: ['superAdmin', 'admin', 'user'], default: 'user', required: true }
  },
  { timestamps: true }
);

const UserModel = model("user", UserSchema);

module.exports = UserModel;
