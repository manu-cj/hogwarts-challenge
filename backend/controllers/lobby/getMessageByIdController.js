import Lobby from "../../models/Lobby.js";
import { validateIdData } from "../validation/getByIdValidationController.js";

export async function getMessageById(req, res) {
    if (!req.query) {
        return res.status(400).json({ message: "L'ID du message est manquant dans les paramètres de la requête." });
    }

    const { id } = req.query;

    const { error } = validateIdData({ id });
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const message = await Lobby.findOne({ _id: id });

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message introuvable."
            });
        }

        return res.status(200).json({
            success: true,
            message
        });

    } catch (error) {
        console.error("Impossible de trouver ce message :", error);
        return res.status(500).json({
            success: false,
            message: "Impossible de récupérer ce message."
        });
    }
}
