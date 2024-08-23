import Joi from "joi";

const reactSchema = Joi.object({
    message_id: Joi.string().required(),
    user_id: Joi.string().required(),
    username: Joi.string().min(3).required(),
})

export function validateReactMessageData(data) {
    return reactSchema.validate(data);
}