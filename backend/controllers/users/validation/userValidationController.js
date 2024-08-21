import Joi from 'joi';

// Définir le schéma de validation des données utilisateur
const userSchema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().min(3).required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),  //for 1Maj min, 1 number min and 5 character min ^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,}$
    repeatPassword: Joi.ref('password'),
    lobbyId: Joi.number()
        .integer().valid(0, 1, 2, 3),
    role: Joi.number().integer().valid(0, 1, 2),
        
});

// Fonction pour valider les données d'utilisateur
export function validateUserData(data) {
    return userSchema.validate(data);
}
