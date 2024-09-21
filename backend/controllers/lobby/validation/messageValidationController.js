import Joi from 'joi';

const messageSchema = Joi.object({
    message: Joi.string().min(10).max(255).required(),
    author: Joi.string().min(3).required(),
    author_id: Joi.string().required(),
    lobby_id: Joi.number()
    .integer().valid(0, 1, 2, 3),
});

export function validateMessageData(data) {
    return messageSchema.validate(data);
}