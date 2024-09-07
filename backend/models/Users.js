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
    hashedPassword: {
        type: String,
        required: true 
    },
    role: {
        type: Number,
        required: true
    },
    lobbyId: {
        type: Number,
        required: true
    },
    refreshToken: {
        type: String,
        required: false 
    }
});

const User = mongoose.model('User', userSchema);

export default User;
