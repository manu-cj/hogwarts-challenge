import Joi from 'joi';

// Définir le schéma de validation des données utilisateur
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),  //for 1Maj min, 1 number min and 5 character min ^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,}$       
});

// Fonction pour valider les données d'utilisateur
export function validateLoginData(data) {
    return loginSchema.validate(data);
}