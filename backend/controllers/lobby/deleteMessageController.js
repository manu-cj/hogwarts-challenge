import Lobby from "./../../models/Lobby.js";
import { validateDeletedMessageData } from "./validation/deleteMessageValidationController.js";
import { io } from './../../server.js';

export async function deleteMessage(req, res) {
    
  if (!req.params) {
    return res.status(400).json({ message: "The params is empty." });
  }
  if (!req.body) {
    return res.status(400).json({ message: "The body is empty" });
  }

  const messageId = req.params.messageId;
  const { authorId, userId } = req.body;
  console.log(messageId);
  


  const { error } = validateDeletedMessageData({
    messageId,
    authorId,
    userId,
  });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  if (authorId !== userId) {
    return res
      .status(400)
      .json({ message: "authorId must be the same as userId" });
  }

  try {
    const existingMessage = await Lobby.findOne({ _id: messageId });
    if (!existingMessage) {
      return res.status(409).json({ message: "This message does not exist" });
    }
    const deletedMessage = await Lobby.findByIdAndDelete(messageId);
    io.emit('messageDeleted', { id: messageId });
    res.status(201).json({
      message: "message deleting with success",
    });

    
  } catch (err) {
    console.error("An error occured");
    res.status(500).json({ message: "An error occured" });
  }
}
