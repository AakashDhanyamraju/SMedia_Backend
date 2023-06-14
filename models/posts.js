// models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  media: [{ type: String }],
  created_at: { type: Date, default: Date.now },
  // likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  // likes: { type:Number, default: 0 },
  likes: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
    likeId: { type: String }
  }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

// postSchema.index({ likes: 0 }, { unique: false, sparse: true, default: null });


module.exports = mongoose.model('Post', postSchema);
