// messageController.js

const Message = require('../models/messages');
const users = require('../models/users');

// Create a new message
exports.createMessage = async (req, res) => {
  try {
    const { conversationId, sender, receiver, content } = req.body;
    const message = new Message({ conversationId, sender, content });
    await message.save();
    res.status(201).json({ message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all messages for a conversation
exports.getMessagesByConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId });
    const allUsers = await users.find()
    const combinedData = messages.map(message => {
      const senderData = allUsers.find(user => user._id.toString() === message.sender.toString()) 
      return {...message.toObject(), senderData: senderData}
    })
    // const messagesWithUsernames = messages.map( message => {
    //   const sender = message.sender === );
    //   const senderData = allUsers.find(user => user._id.toString() === otherUser.toString())
    //   return { _id: conversation._id, userData: otherUserData ,createdAt: conversation.createdAt, updatedAt: conversation.updatedAt, __v: conversation.__v };
    // });

    console.log(combinedData)
    res.json(combinedData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
