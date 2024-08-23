import Response from "./../../models/Response.js";
import Notification from "./../../models/Notification.js";
import { validateResponseMessageData } from "./validation/responseValidationController.js";
import { validateNotificationData } from "../users/validation/notificationValidationController.js";

export async function addResponse(req, res) {
    if (!req.body) {
        return res
          .status(400)
          .json({ message: "Le corps de la requête est vide." });
      }

      const {message_id, user_id, username, message,post_reacted_id ,message_notif} = req.body;

      const { error } = validateResponseMessageData({
        message_id,
        user_id,
        username,
        message,
        message_notif
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

        const checked = false;
        const newNotification = new Notification({
            user_id,
            post_reacted_id,
            message_notif,
            checked
        })
        await newNotification.save();
        res.status(201).json({
            message: "Reponse ajouté au message avec succès",
        });
        // Endroit ou je mettrais la fonction pour ajouté une notification
        // if (res.status(201)) {
        //     console.log("la réponse est 201"); 
        // }
      } catch (err) {
        console.error("Erreur lors de l'ajout de la reponse:", err);
        res
            .status(500)
            .json({message: "Erreur lors de l'ajout de la réponse."})
        
      }

}