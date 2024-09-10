import User from "../../models/Users.js";
import { validateIdData } from "../validation/getByIdValidationController.js";

export async function getUser(req, res) {
    if (!req.user.id) {
        return res.status(400).json({ message: "L'ID utilisateur est manquant" });
    }
    const id = req.user.id;

    const { error } = validateIdData({ id });
    if (error) {
        return res.status(400).json({ message: error.details[0].message})
    }

    try {
        
        const user = await User.findById(id).select('-hashedPassword -refreshToken'); // Ne pas retourner le mot de passe

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error('Erreur lors de la récupération des données de l’utilisateur:', error);
        return res.status(500).json({ message: "Erreur lors de la récupération des données." });
    }
    
}