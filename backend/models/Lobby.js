import mongoose from 'mongoose';

// Définition du schéma avec les options de timestamps
const lobbySchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255,
    },
    author: {
        type: String,
        required: true,
    },
    author_id: {
        type: String,
        required: true,
    },
    lobby_id: {
        type: Number,
        required: true,
    },
},
{
    timestamps: true,  // Ajoute automatiquement `createdAt` et `updatedAt`
    collection: 'lobby'
});

// Création du modèle basé sur le schéma
const Lobby = mongoose.model('Lobby', lobbySchema);

export default Lobby;
