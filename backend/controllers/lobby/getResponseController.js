import Response from "../../models/Response.js";
import { validatePaginationData } from "./validation/paginationValidationController.js";


export async function getResponses(req, res) {
    const {limit} = req.query;

    const page = 1
    const { error } = validatePaginationData({
        page,
        limit
    })
    if (error) {
        res.status(400).json({message: error.details[0].message})
    }

    const pageLimit = parseInt(limit, 10);

    if (isNaN(pageLimit) || pageLimit <= 0) {
        return res.status(400).json({
            success: false,
            message: "Limit must be a positive number."
        });
    }

    try {
        const responses = await Response.find().limit(pageLimit);
        return res.status(200).json({
            success: true,
            limit: pageLimit,
            responses
        })
        
    } catch (error) {
        console.error("Aucune réponse pour ce message.", error);
        res
            .status(500)
            .json({
                success:false,
                message: "Aucune réponse pour ce message"
            })
        
    }
}