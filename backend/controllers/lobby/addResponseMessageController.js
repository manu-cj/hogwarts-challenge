import Response from "./../../models/Response.js";
import { validateResponseMessageData } from "./validation/responseValidationController.js";

export async function addResponse(req, res) {
    if (!req.body) {
        return res
          .status(400)
          .json({ message: "Le corps de la requête est vide." });
      }

      const {message_id, user_id, username, message} = req.body;

      const { error } = validateResponseMessageData({
        message_id,
        user_id,
        username,
        message
      })

      if (error) {
        return res.status(400).json({ message: error.details[0].message })
      }

      try {
        const newResponseMessage = new Response({
            message_id,
            user_id,
            username,
            message
        })
        await newResponseMessage.save();

        res.status(201).json({
            message: "Reponse ajouté au message avec succès",
        });
      } catch (err) {
        console.error("Erreur lors de l'ajout de la reponse:", err);
        res
            .status(500)
            .json({message: "Erreur lors de l'ajout de la réponse."})
        
      }

}