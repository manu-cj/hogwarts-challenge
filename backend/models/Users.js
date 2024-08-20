import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true  // Assure que le mot de passe est requis
    },
    role: {
        type: Number,
        required: true
    },
    lobbyId: {
        type: Number,
        required: true
    },
    token: {
        type: String,
        required: true
    },
});

const User = mongoose.model('User', userSchema);

export default User;
