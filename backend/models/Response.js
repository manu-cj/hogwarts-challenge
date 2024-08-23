import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
    message_id: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255,
    },
},
{
    timestamps: true,  // Ajoute automatiquement `createdAt` et `updatedAt`
    collection: 'response_message'
});

const Response = mongoose.model('Response', responseSchema);

export default Response;