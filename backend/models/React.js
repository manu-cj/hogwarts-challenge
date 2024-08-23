import mongoose from "mongoose";

const reactSchema = new mongoose.Schema({
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
},
{
     timestamps: true,  // Ajoute automatiquement `createdAt` et `updatedAt`
    collection: 'response_message'
})

const React = mongoose.model('React', reactSchema);

export default React;