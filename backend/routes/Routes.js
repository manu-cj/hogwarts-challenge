import express, { Router } from "express";
import { addUser } from "../controllers/users/addUserController.js";
import { login } from "../controllers/users/loginController.js";
import { verifyAccessToken } from '../middleware/authMiddleware.js';
import { refreshToken } from './../controllers/users/refreshTokenController.js';
import { addMessage } from "../controllers/lobby/addMessageController.js";
import { addResponse } from "../controllers/lobby/addResponseMessageController.js";
import { addReact } from "../controllers/lobby/addReactController.js";
import { getMessages } from "../controllers/lobby/getMessageController.js";
import { getResponses } from "../controllers/lobby/getResponseController.js";


const router = express.Router();

// Routes POST
router.post("/registre", addUser);
router.post("/auth", login);
router.post('/refresh-token', refreshToken);
router.post('/add-message', verifyAccessToken, addMessage);
router.post('/add-response', verifyAccessToken, addResponse);


//Routes GET 
router.get('/add-react', verifyAccessToken, addReact);
router.get('/get-responses-message', verifyAccessToken, getResponses);

//Routes put


//Routes delete




router.post("/get-lobby-messages", verifyAccessToken, getMessages)
export default function (app) {
  app.use("/api", router);
}
