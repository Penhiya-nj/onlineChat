const { Schema, model, Types } = require("mongoose");

const OTPSchema = new Schema({
  code: { type: String, required: false, default: undefined },
  expiresIn: { type: Number, required: false, default: () => (1000 * 60 * 2.5).toString() },
  type: { type: String, required: true, default: 'login' }
});

const BlacklistTokenSchema = new Schema({
  token: { type: String, required: true }, // The token being blacklisted
  expiresAt: { type: Date, required: true } // Expiration date of the token
});

// Correctly applying the TTL index on blacklist.expiresAt
BlacklistTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const chatwootAdminSchema = new Schema({
  chatwoot_id: { type: Number, required: true }
});

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: false },
    otp: { type: OTPSchema },
    accessToken: { type: String },
    blacklist: [BlacklistTokenSchema], // Array of blacklisted tokens
    role: { type: String, enum: ['superAdmin', 'admin', 'user'], default: 'user', required: true },
    chatwoot_admin: { type: chatwootAdminSchema, required: false },
    websites: [{ type: Types.ObjectId, ref: 'website', required: false }],
  },
  { timestamps: true }
);

// Auto-populate websites in find and findOne queries
UserSchema.pre(/^find/, function (next) {
  this.populate('websites');
  next();
});

const UserModel = model("user", UserSchema);

module.exports = UserModel;
