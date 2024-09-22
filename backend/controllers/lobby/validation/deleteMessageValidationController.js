import Joi from "joi";

const deleteMessageSchema = Joi.object({
    messageId: Joi.string().required(),
    authorId: Joi.string().required(),
    userId: Joi.string().required()
    
}).custom((value, helpers) => {
    if (value.authorId !== value.userId) {
        return helpers.error("any.custom", { message: "authorId must be the same as userId" });
    }
    return value;
});

export function validateDeletedMessageData(data) {
    return deleteMessageSchema.validate(data);
}