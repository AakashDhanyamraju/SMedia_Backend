// controllers/postController.js
const Post = require('../models/posts');
const User = require('../models/users')
const cloudinary = require('cloudinary')
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');


cloudinary.config({ 
  cloud_name: 'dpxjh7bwy', 
  api_key: '253513383449948', 
  api_secret: '6LnwfzKvLDCDVYE_qe2Pkosg65c' 
});


module.exports = {
  getAllPosts: async (req, res) => {
    try {
      const posts = await Post.find();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get posts' });
    }
  },

  // getPostById: async (req, res) => {
  //   try {
  //     const post = await Post.findById(req.params.id);
  //     if (!post) {
  //       return res.status(404).json({ error: 'Post not found' });
  //     }
  //     res.json(post);
  //   } catch (error) {
  //     res.status(500).json({ error: 'Failed to get post' });
  //   }
  // },

  createPost: async (req, res) => {
    try {
      
      // const timestamp = Date.now();
      // console.log(req.boby.media)
      // const imageUrl = []
      // cloudinary.v2.uploader.upload(req.body.media[0],
      // { public_id: timestamp  }, 
      // function(error, result) {console.log(result); if(error) return res.json({message: error}) });
      // const media = req.body.media
      // console.log(media)
      // req.body.media.map( async image => {
      //   const uploadResult = await cloudinary.uploader.upload(image);
      //   imageUrl.push(uploadResult.secure_url) 
      // })
      // Loop through each media file and upload it to Cloudinary
      // for (let i = 0; i < media.length; i++) {
      //   const image = media[i];
      //   const uploadResult = await cloudinary.uploader.upload(image);
      //   imageUrl.push(uploadResult.secure_url);
      // }
      const uploadResult = await cloudinary.uploader.upload(req.body.media);
      // Retrieve the uploaded image URL
      const imageUrl = uploadResult.secure_url;
      // console.log(imageUrl);
      // Create a new post with the user, content, and media URLs
      const post = await Post.create({
        user: req.body.user,
        content: req.body.content,
        media: imageUrl,
        likes:[{user: req.user, postId: uuidv4()} ]
      });      
      res.status(201).json(post);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Failed to create post' });
    }
  },

  updatePost: async (req, res) => {
    try {
      const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update post' });
    }
  },

  deletePost: async (req, res) => {
    try {
      const post = await Post.findByIdAndRemove(req.params.id);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      res.json({ message: 'Post deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete post' });
    }
  },



  getPostsWithUsername: async (req, res) => {
    try {
        
        const fetchedPosts = await Post.find().sort({created_at: -1});
        const fetchedUsers = await User.find();
        const combinedData = fetchedPosts.map(post => {
          // console.log('post', post.user);
          const user = fetchedUsers.find(user => {
            // console.log("user", user._id);
            return user._id.toString() === post.user.toString();
          });
          // console.log('user', user);
          const username = user ? user.username : 'Unknown';
          const avatar = user ? user.avatar :  ''
          // console.log(username);
          return {
            ...post.toObject(),
            username: username,
            avatar : avatar
          };
        });
        // console.log(combinedData)
        res.json(combinedData)
      } catch (error) {
        console.error(error);
      }
  },


  getPostsById: async (req, res) => {
    try {
        const userId = req.params.id
        const fetchedPosts = await Post.find({user: userId}).sort({created_at: -1});
        const fetchedUser = await User.findOne({ _id: userId });
        const combinedData = fetchedPosts.map(post => {
            if(userId.toString() === post.user.toString()){
              const username = fetchedUser.username ? fetchedUser.username : 'Unknown';
              const avatar = fetchedUser ? fetchedUser.avatar :  ''
              return {
                ...post.toObject(),
                username: username,
                avatar : avatar
              };
            }
          
          // console.log(username);
          
        });
        // console.log(combinedData)
        res.json(combinedData)
      } catch (error) {
        console.error(error);
      }
  },

  // postLike: async (req, res) => {
  //   try {
  //     const postId = req.params.id;

  //     const strPostId = postId.toString()
  //     // console.log(new mongoose.Types.ObjectId(postId))

  //     // Find the post by its ID
  //     const post = await Post.findById(postId);
  //     // console.log(post.likes[0].toString())
  
  //     if (!post) {
  //       return res.status(404).json({ error: 'Post not found' });
  //     }
  //     // if(post.likes.find(postId)){
  //     //   return res.status(404).json({ error: 'User Already Liked this post' });
  //     // }
  //     if (post.likes.includes(new mongoose.Types.ObjectId(req.user))) {
  //       return res.status(404).json({ error: 'User Already Liked this post' });
  //     }
  //     // if(post.likes.find(postId))
  
  //     // Increment the likes count
  //     // post.likes += 1;
  //     post.likes.push(req.user)
  
  //     // Save the updated post
  //     await post.save();
  
  //     res.json({ message: 'Post liked successfully' });
  //   } catch (error) {
  //     console.error('Error liking post', error);
  //     res.status(500).json({ error: error });
  //   }
  // },

  postLike: async (req, res) => {
    try {
      const postId = req.params.id;
  
      // Find the post by its ID
      const post = await Post.findById(postId);
  
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      const userId = req.user; // Assuming req.user contains the ID of the current user
  
      // Check if the user has already liked the post
      const alreadyLiked = post.likes.some(like => like.user.toString() === userId);
  
      if (alreadyLiked) {
        return res.status(404).json({ error: 'User already liked this post' });
      }
  
      // Generate a unique like ID (e.g., using a UUID library)
      const likeId = uuidv4(); // Replace with your implementation
  
      // Push the user ID and like ID to the likes array
      post.likes.push({ user: userId, likeId });
  
      // Save the updated post
      await post.save();
  
      return res.json({ message: 'Post liked successfully' });
    } catch (error) {
      console.error('Error liking post', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
  

  
};
