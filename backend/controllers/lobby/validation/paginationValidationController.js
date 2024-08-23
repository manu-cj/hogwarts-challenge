import Joi from "joi";

const paginationSchema = Joi.object({
    page: Joi.number().integer().required(),
    limit: Joi.number().integer().required()
})

export function validatePaginationData(data) {
    return paginationSchema.validate(data);
}