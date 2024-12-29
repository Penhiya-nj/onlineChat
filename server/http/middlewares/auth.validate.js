// userUpdateValidator.js

const autoBind = require("auto-bind");
const createHttpError = require("http-errors");
const Joi = require("joi");

const schema = Joi.object({
  role: Joi.string().valid("superAdmin", "admin", "user").optional(),
  mobile: Joi.string().optional(),
  email: Joi.string().email().optional(),
}).unknown(false);
exports.schema = schema;

const registerSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),

  email: Joi.string()
    .email({ tlds: { allow: false } }) //email format
    .required(),

  password: Joi.string()
    .min(8)
    .max(100)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$")) //format
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*).',
      'string.min': 'Password must be at least 8 characters long.',
      'string.max': 'Password cannot exceed 100 characters.',
      'any.required': 'Password is required.',
    }),
});
exports.registerSchema = registerSchema;

class AuthValidator {
  constructor() {
    // Define the Joi validation schema
    autoBind(this)
    this.schema = schema
    this.registerSchema = registerSchema
  }

  // Middleware method to validate request
  ValidateUpdateUser(req, res, next) {
    try {
      const { error, value } = this.schema.validate(req.body, {
        stripUnknown: true,
      });
      if (error) {
        throw createHttpError.BadRequest(error.details[0].message, {
          details: error.details,
          errorLevel: "authValidation.updateUser",
        });
      }
      req.body = value;
      next();
    } catch (error) {
      next(error);
    }
  }

  register(req, res, next) {
    try {
      const { error, value } = this.registerSchema.validate(req.body, {
        stripUnknown: true,
      });
      if (error) {
        throw createHttpError.BadRequest(error.details[0].message, {
          details: error.details,
          errorLevel: "authValidation.register",
        });
      }
      req.body = value;
      next();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthValidator();
