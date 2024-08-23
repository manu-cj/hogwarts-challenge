import Joi from "joi";

const notificationSchema = Joi.object({
    user_id: Joi.string().required(),
    message_id: Joi.string().required(),
    message: Joi.string().min(3).max(255).required(),
});

export function validateNotificationData(data) {
    return notificationSchema.validate(data);
}