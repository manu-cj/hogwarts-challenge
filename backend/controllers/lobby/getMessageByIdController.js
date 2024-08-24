import Lobby from "../../models/Lobby.js";
import { validateIdData } from "../validation/getByIdValidationController.js";


export async function getMessageById(req, res) {
    if (!req.body) {
        return res
          .status(400)
          .json({ message: "Le corps de la requête est vide." });
      }
    const {id} =req.params;

    const { error } = validateIdData({
        id
    })
    if (error) {
        res.status(400).json({message: error.details[0].message})
    }

    try {
        const message = await Lobby.find(id)
        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message introuvable."
            }); // Ajout du return ici
        }
        return res.status(200).json({
            success: true,
            message
        })
    } catch (error) {
        console.log("Impossible de trouver ce message.", error);
        res
            .status(500)
            .json({
                success:false,
                message: "Impossible de trouvé ce message"
            })

    }
}