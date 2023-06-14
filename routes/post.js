// routes/post.js
const express = require('express');
const router = express.Router();
const PostController = require('../controllers/postController');
const postController = require('../controllers/postController');

// Post routes
router.get('/', PostController.getAllPosts);
router.get('/:id', PostController.getPostsById);
router.post('/', PostController.createPost);
router.put('/:id', PostController.updatePost);
router.delete('/:id', PostController.deletePost);
router.post('/:id/like', PostController.postLike)
router.get('/api/postswithusername', PostController.getPostsWithUsername)

module.exports = router;
