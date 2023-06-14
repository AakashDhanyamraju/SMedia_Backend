// models/Friend.js
const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: false },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: false },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Friend', friendSchema);


// models/Friend.js
// const mongoose = require('mongoose');

// const friendSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   friend: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   created_at: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('Friend', friendSchema);

