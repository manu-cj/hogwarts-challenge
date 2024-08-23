import Lobby from "../../models/Lobby.js";
import { validatePaginationData } from "./validation/paginationValidationController.js";

export async function getMessages(req, res) {
    const {page, limit} = req.query;

    const {error} = validatePaginationData({
        page,
        limit
    })
    if (error) {
        res.status(400).json({message: error.details[0].message})
    }

    const pageIndex = parseInt(page, 10);
    const pageLimit = parseInt(limit, 10);

    if (isNaN(pageIndex) || pageIndex <= 0) {
        return res.status(400).json({
            success: false,
            message: "Page index must be a positive number."
        });
    }
    if (isNaN(pageLimit) || pageLimit <= 0) {
        return res.status(400).json({
            success: false,
            message: "Limit must be a positive number."
        });
    }

    const skip = (pageIndex - 1) * pageLimit;
    try {
        const messages = await Lobby.find().skip(skip).limit(pageLimit);
        return res.status(200).json({
            success: true,
            page: pageIndex,
            limit: pageLimit,
            messages
        })
    } catch (error) {
        console.error("Aucun message dans le lobby", error);
        res
            .status(500)
            .json({
                success:false,
                message: "Aucun message dans le lobby"
            })
        
    }
}