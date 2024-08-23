import express from "express";
import { addUser } from "../controllers/users/addUserController.js";
import { login } from "../controllers/users/loginController.js";
import { verifyAccessToken } from '../middleware/authMiddleware.js';
import { refreshToken } from './../controllers/users/refreshTokenController.js';
import { addMessage } from "../controllers/lobby/addMessageController.js";
import { addResponse } from "../controllers/lobby/addResponseMessageController.js";

const router = express.Router();

// Route POST pour ajouter un utilisateur
router.post("/registre", addUser);
router.post("/auth", login);
router.post('/refresh-token', refreshToken);
router.post('/add-message', verifyAccessToken, addMessage);
router.post('/add-response', verifyAccessToken, addResponse);

export default function (app) {
  app.use("/api", router);
}
