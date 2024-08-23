import React from './../../models/React.js';
import { validateReactMessageData } from './validation/reactValidationController.js';

export async function addReact(req, res) {
    if (!req.body) {
        return res
          .status(400)
          .json({ message: "Le corps de la requête est vide." });
      }

      const {message_id, user_id, username} = req.body;

      const { error } = validateReactMessageData({
        message_id,
        user_id,
        username
      })

      if (error) {
        return res.status(400).json({message: error.details[0].message})
      }

      try {
        const newReactMeassage = new React({
            message_id,
            user_id,
            username
        })
        await newReactMeassage.save();

        res.status(201).json({
            message: "Reaction ajouté avec succès",
        })

        
      } catch (error) {
        console.log("Erreur lors de l'ajout de la réaction");
        res
            .status(500)
            .json({message: "Erreur lors de l'ajout de la réaction"})
      }
}