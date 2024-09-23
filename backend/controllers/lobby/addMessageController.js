import Lobby from './../../models/Lobby.js';
import { validateMessageData } from './validation/messageValidationController.js';
import { io } from './../../server.js';



export async function addMessage(req, res) {
    if (!req.body) {
        return res
          .status(400)
          .json({ message: "Le corps de la requête est vide." });
      }

      const {message, author, author_id, lobby_id} = req.body;

      const { error } = validateMessageData({    
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
            message,
            author,
            author_id,
            lobby_id
        })
        await newLobbyMessage.save();

        io.emit('newMessage', {
          _id: newLobbyMessage._id,
          message,
          author,
          author_id,
          lobby_id,
          createdAt: newLobbyMessage.createdAt,
          updatedAt: newLobbyMessage.updatedAt,
        });

        

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