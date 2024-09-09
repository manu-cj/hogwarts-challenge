import User from '../../models/Users.js';
import Login from './../../models/Login.js';
import { validateLoginData } from './validation/loginValidationController.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export async function login(req, res) {
    if (!req.body) {
        return res
          .status(400)
          .json({ message: "Le corps de la requête est vide." });
      }

      const { email, password } = req.body;

      const { error } = validateLoginData({
        email,
        password
      });
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: "L'utilisateur n'existe pas." });
        }

 const isMatch = await bcrypt.compare(password, user.hashedPassword);
 if (!isMatch) {
     return res.status(400).json({ message: "Le mot de passe est incorrect." });
 }


 const JWT_SECRET = process.env.JWT_SECRET;
 const accessToken = jwt.sign(
     { id: user._id }, // Payload
     JWT_SECRET, // Clé secrète
     { algorithm: "HS256", expiresIn: '1h' } // Expiration en 1 heure
 );

 const REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET;
 const refreshToken = jwt.sign(
     { id: user._id }, 
     REFRESH_JWT_SECRET, 
     { algorithm: "HS256", expiresIn: '7d' } // Expire dans 7 jours
 );

 user.refreshToken = refreshToken;
 await user.save();

 return res.status(200).json({
     message: "Connexion réussie.",
     accessToken,
     refreshToken 
 });
    } catch (error) {
        console.error('Erreur lors de la vérification du mot de passe:', error);
        return res.status(500).json({ message: "Erreur lors de la connexion." });
    }
    


}