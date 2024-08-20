import jwt from 'jsonwebtoken';
import User from './../../models/Users.js';
import { validateUserData } from './userValidationController.js';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// Fonction pour gérer l'ajout d'un utilisateur
export async function addUser(req, res) {
    if (!req.body) {
        return res.status(400).json({ message: "Le corps de la requête est vide." });
    }

    // Déstructuration des données
    const { email, username, password, repeatPassword, role,lobbyId } = req.body;

    // Générer un token
    const token = jwt.sign(
        { email, username }, // Payload
        JWT_SECRET, // Clé secrète
        { algorithm: 'HS256' } // Optionnel : spécifie l'algorithme de signature
    );

    // Validation des données d'entrée
    const { error } = validateUserData({ email, username, password, repeatPassword, role, lobbyId });
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // Vérifier si le mot de passe correspond à la répétition du mot de passe
    if (password !== repeatPassword) {
        return res.status(400).json({ message: "Les mots de passe ne correspondent pas." });
    }

    try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Cet utilisateur existe déjà." });
        }

        // Créer un nouvel utilisateur
        const newUser = new User({ email, username, password, role, lobbyId, token }); // Ajoute le mot de passe
        await newUser.save();

        

        console.log(`Added ${email} to DB`);
        res.status(201).json({
            message: "Utilisateur ajouté avec succès.",
            token
        });
    } catch (err) {
        console.error('Erreur lors de la création de l\'utilisateur:', err);
        res.status(500).json({ message: "Erreur lors de la création de l'utilisateur." });
    }
}
