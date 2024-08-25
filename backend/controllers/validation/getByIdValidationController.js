import Joi from "joi";

const getByIdSchema = Joi.object({
    id: Joi.string().required().messages({
        'string.empty': `"id" ne peut pas être vide.`,
        'any.required': `"id" est requis.`
    })
})

export function validateIdData(data) {
    return getByIdSchema.validate(data);
}