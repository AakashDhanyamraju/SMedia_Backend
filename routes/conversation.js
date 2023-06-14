// conversationRouter.js

const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');

// Create a new conversation
router.post('/', conversationController.createConversation);

// Get all conversations
router.get('/:id', conversationController.getConversationsById);
router.get('/getconversations', conversationController.getAllConversations);

// router.get('/getConversations', conversationController.getAllConversations);


module.exports = router;
