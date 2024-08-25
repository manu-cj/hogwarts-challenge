import Notification from "../../models/Notification.js";
import { validateIdData } from "../validation/getByIdValidationController.js";

export async function getNotifications(req, res) {
    if (!req.query) {
        return res.status(400).json({ message: "L'ID utilisateur est manquant dans les paramètres de la requête." });
    }
    const { id } = req.query;

    if (!id) {
        return res
            .status(400)
            .json({ message: "L'ID utilisateur est manquant dans les paramètres de la requête." });
    }

    const { error } = validateIdData({ id });
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const notifications = await Notification.find({ user_id: id });

        if (notifications.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Aucune notification trouvée pour cet utilisateur.",
            });
        }

        return res.status(200).json({
            success: true,
            notifications
        });
        
    } catch (error) {
        console.error("Impossible de trouver les notifications :", error);
        return res.status(500).json({
            success: false,
            message: "Impossible de récupérer les notifications."
        });
    }
}
