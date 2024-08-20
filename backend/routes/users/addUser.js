// routes/userRoutes.js
import express from 'express';
import { addUser } from './../../controllers/users/userController.js';

const router = express.Router();

// Route POST pour ajouter un utilisateur
router.post('/registre', addUser);

export default function (app) {
    app.use('/api', router);
}
