const autoBind = require('auto-bind');
const Joi = require('joi');


/**
 * Joi schema for account creation validation (name & domain only).
 */
const accountSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.base': '"name" should be a type of string',
        'string.empty': '"name" cannot be empty',
        'any.required': '"name" is required',
    }),
    domain: Joi.string()
        .pattern(/^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\:\d+)?(\/\S*)?$/)
        .allow(null)
        .messages({
            'string.base': '"domain" should be a type of string',
            'string.pattern.base': '"domain" must be a valid domain or URI (e.g., www.example.com, http://example.com)',
            'any.allowOnly': '"domain" must be null or a valid domain/URI',
        }),

    email: Joi.string()
        .email({ tlds: { allow: false } }) // Disables strict TLD validation
        .allow(null)
        .messages({
            'string.base': '"email" should be a type of string',
            'string.email': '"email" must be a valid email address',
            'any.allowOnly': '"email" must be null or a valid email address',
        }),
});
const updateAccountSchema = Joi.object({
    name: Joi.string().messages({
        'string.base': '"name" should be a type of string',
        'string.empty': '"name" cannot be empty',
        'any.required': '"name" is required',
    }),
    domain: Joi.string()
        .pattern(/^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\:\d+)?(\/\S*)?$/)
        .allow(null)
        .messages({
            'string.base': '"domain" should be a type of string',
            'string.pattern.base': '"domain" must be a valid domain or URI (e.g., www.example.com, http://example.com)',
            'any.allowOnly': '"domain" must be null or a valid domain/URI',
        }),

    email: Joi.string()
        .email({ tlds: { allow: false } }) // Disables strict TLD validation
        .allow(null)
        .messages({
            'string.base': '"email" should be a type of string',
            'string.email': '"email" must be a valid email address',
            'any.allowOnly': '"email" must be null or a valid email address',
        }),
});


class websiteValidator {
    constructor() {
        autoBind(this)
        this.accountSchema = accountSchema
        this.updateAccountSchema = updateAccountSchema

    }
    //POST
    async validatePost(req, res, next) {
        const { error, value } = accountSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true // Removes fields not specified in the schema
        });

        if (error) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid input',
                details: error.details.map((err) => err.message),
            });
        }

        req.body = value; // Update request body with validated and sanitized values
        next();
    };
}

module.exports = new websiteValidator();
