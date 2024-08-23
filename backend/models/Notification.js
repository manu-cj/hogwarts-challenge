import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    post_reacted_id: {
        type: String,
        required: true
    },
    message_notif: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 55,
    },
    checked: {
        type: Boolean,
        required: true
    }
},
{
    timestamps: true,  // Ajoute automatiquement `createdAt` et `updatedAt`
   collection: 'notifications'
}
)

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;