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
import { getMessageById } from "../controllers/lobby/getMessageByIdController.js";
import { getNotifications } from "../controllers/users/getNotificationsController.js";


const router = express.Router();

// Routes POST
router.post("/registre", addUser);
router.post("/auth", login);
router.post('/refresh-token', refreshToken);
router.post('/add-message', verifyAccessToken, addMessage);
router.post('/add-response', verifyAccessToken, addResponse);
router.post('/add-react', verifyAccessToken, addReact);


//Routes GET 
router.get("/get-lobby-messages", verifyAccessToken, getMessages);
router.get('/get-responses-message', verifyAccessToken, getResponses);
router.get('/get-message', verifyAccessToken, getMessageById)//affiche le message correspondant à l'id
router.get('/get-notifications', verifyAccessToken, getNotifications);


//Routes put
 

//Routes delete




export default function (app) {
  app.use("/api", router);
}
