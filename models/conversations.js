const mongoose = require('mongoose');

// const Conversation = mongoose.model('Conversation', conversationSchema);


const conversationSchema = new mongoose.Schema({
//   members:{ type:Array }
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' ,unique: false,
  sparse: true }]
}, { timestamps: true });

const Conversation = mongoose.model('Conversation', conversationSchema);

// const conversationSchema = new mongoose.Schema({
//   users: {
//     type: [{
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     }],
//     validate: {
//       validator: function (users) {
//         return users.length === new Set(users).size;
//       },
//       message: 'The users array must contain unique elements.'
//     }
//   }
// });

// conversationSchema.pre('save', function (next) {
//   const conversation = this;

//   // Check if the current conversation's users array already exists in the database
//   mongoose.models.Conversation.findOne({ users: [conversation.users] }, function (err, existingConversation) {
//     if (err) {
//       return next(err);
//     }
    
//     if (existingConversation) {
//       const error = new Error('Conversation with the same users already exists.');
//       return next(error);
//     }

//     next();
//   });
// });

// const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
