// routes/friend.js
const express = require('express');
const router = express.Router();
const FriendController = require('../controllers/friendController');

// Friend routes
router.get('/friend-requests', FriendController.recievedRequests);
router.get('/sent-requests', FriendController.sentRequests);
router.get('/allfriends', FriendController.allFriends);
router.get('/:id', FriendController.getFriendsById);



router.post('/send-request', FriendController.sendRequest);
router.put('/accept-request/:id', FriendController.acceptRequest);
router.put('/reject-request/:id', FriendController.rejectRequest);

module.exports = router;
