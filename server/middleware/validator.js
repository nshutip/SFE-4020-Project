const Joi = require("joi");

const validator = (schema) => (payload) => schema.validate(payload, {abortEarly: false});

const signupSchema = Joi.object({
    first_name: Joi.string().min(4).required(),
    last_name: Joi.string().min(4).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(12).required(),
});

exports.validateSignUp = validator(signupSchema);

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

exports.validateLogIn = validator(loginSchema);

const querySchema = Joi.object({
    name: Joi.string().min(4).required(),
    email: Joi.string().email().required(),
    message: Joi.string().min(4).required(),
});

exports.validateQuery = validator(querySchema);

const articleSchema = Joi.object({
    title: Joi.string().min(6).max(60).required(),
    image: Joi.any().meta({swaggerType: 'file'}).optional().allow('').description('image file'),
    content: Joi.string().required(),
});

exports.validateArticle = validator(articleSchema);

const commentSchema = Joi.object({
    comment: Joi.string().required(),
})

exports.validateComment = validator(commentSchema);

const likeSchema = Joi.object({
    like: Joi.boolean().required(),
})

exports.validateLike = validator(likeSchema);