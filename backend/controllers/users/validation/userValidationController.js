import Joi from 'joi';

// Définir le schéma de validation des données utilisateur
const userSchema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().min(3).required(),
    password: Joi.string()
        .pattern(new RegExp('^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,}$')),  //1Maj min, 1 number min and 5 character min 
    repeatPassword: Joi.ref('password'),
    lobbyId: Joi.number()
        .integer().valid(0, 1, 2, 3),
    role: Joi.number().integer().valid(0, 1, 2),
        
});

// Fonction pour valider les données d'utilisateur
export function validateUserData(data) {
    return userSchema.validate(data);
}
