import express from "express";
import { addUser } from "../../controllers/users/addUserController.js";
import { login } from "../../controllers/users/loginController.js";
const router = express.Router();

// Route POST pour ajouter un utilisateur
router.post("/registre", addUser);
router.get("/login", login);

export default function (app) {
  app.use("/api", router);
}
