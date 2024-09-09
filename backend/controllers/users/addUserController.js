import jwt from "jsonwebtoken";
import User from "./../../models/Users.js";
import { validateUserData } from "./validation/userValidationController.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();
// Fonction pour gérer l'ajout d'un utilisateur
export async function addUser(req, res) {
  if (!req.body) {
    return res
      .status(400)
      .json({ message: "Le corps de la requête est vide." });
  }

  // Déstructuration des données
  const { email, username, password, repeatPassword, role, lobbyId } = req.body;

  // Validation des données d'entrée
  const { error } = validateUserData({
    email,
    username,
    password,
    repeatPassword,
    role,
    lobbyId,
  });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  if (password !== repeatPassword) {
    return res
      .status(400)
      .json({ message: "Les mots de passe ne correspondent pas." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Cet utilisateur existe déjà." });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      email,
      username,
      hashedPassword,
      role,
      lobbyId,
    });
    await newUser.save();

    console.log(`Added ${email} to DB`);
    res.status(201).json({
      message: "Utilisateur ajouté avec succès.",
    });
  } catch (err) {
    console.error("Erreur lors de la création de l'utilisateur:", err);
    res
      .status(500)
      .json({ message: "Erreur lors de la création de l'utilisateur." });
  }
}
