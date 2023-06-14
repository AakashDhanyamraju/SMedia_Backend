// messageRouter.js

const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Create a new message
router.post('/', messageController.createMessage);

// Get all messages for a conversation
router.get('/:conversationId', messageController.getMessagesByConversation);

module.exports = router;
