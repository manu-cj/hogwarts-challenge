import Lobby from './../../models/Lobby.js';
import { validateMessageData } from './validation/messageValidationController.js';


export async function addMessage(req, res) {
    if (!req.body) {
        return res
          .status(400)
          .json({ message: "Le corps de la requête est vide." });
      }

      const {sujet, message, author, author_id, lobby_id} = req.body;

      const { error } = validateMessageData({
        sujet,
        message,
        author,
        author_id,
        lobby_id
      })

      if (error) {
        return res.status(400).json({ message: error.details[0].message })
      }

      try {
        const newLobbyMessage = new Lobby({
            sujet,
            message,
            author,
            author_id,
            lobby_id
        })
        await newLobbyMessage.save();

        res.status(201).json({
            message: "Message ajouté au lobby avec succès",
        });
      } catch (err) {
        console.error("Erreur lors de l'ajout du message:", err);
        res
            .status(500)
            .json({ message:"Erreur lors de l'ajout du message." })
      }
}