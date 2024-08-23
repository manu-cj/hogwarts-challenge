import React from './../../models/React.js';
import Notification from './../../models/Notification.js';
import { validateReactMessageData } from './validation/reactValidationController.js';
import { validateNotificationData } from '../users/validation/notificationValidationController.js';

export async function addReact(req, res) {
    if (!req.body) {
        return res
          .status(400)
          .json({ message: "Le corps de la requête est vide." });
      }

      const {message_id, user_id, username, post_reacted_id, message} = req.body;

      const { error } = validateReactMessageData({
        message_id,
        user_id,
        username
      })

      if (error) {
        return res.status(400).json({message: error.details[0].message})
      }

      const { err } = validateNotificationData({
        user_id,
        post_reacted_id,
        message
    })
    if (err) {
        res.status(400).json({message: err.details[0].message});
    }

      try {
        const newReactMeassage = new React({
            message_id,
            user_id,
            username
        })
        await newReactMeassage.save();

        const checked = false;
        const newNotification = new Notification({
            user_id,
            post_reacted_id,
            message,
            checked
        })
        await newNotification.save();

        res.status(201).json({
            message: "Reaction ajouté avec succès",
        })

        

        
        // Endroit ou je mettrais la fonction pour ajouté une notification
        // if (res.status(201)) {
        //     console.log("la réponse est 201"); 
        // }
        
      } catch (error) {
        console.log("Erreur lors de l'ajout de la réaction");
        res
            .status(500)
            .json({message: "Erreur lors de l'ajout de la réaction"})
      }
}