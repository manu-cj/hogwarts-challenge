import Joi from "joi";

const responseSchema = Joi.object({
    message_id: Joi.string().required(),
    user_id: Joi.string().required(),
    username: Joi.string().min(3).required(),
    message: Joi.string().min(3).max(255).required(),
});

export function validateResponseMessageData(data) {
    return responseSchema.validate(data);
}