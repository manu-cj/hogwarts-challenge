import Joi from "joi";

const getByIdSchema = Joi.object({
    id: Joi.string().required
})

export function validateIdData(data) {
    return getByIdSchema.validate(data);
}