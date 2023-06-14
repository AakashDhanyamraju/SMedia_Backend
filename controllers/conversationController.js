// const Conversation = require('../models/conversation');

// // Create a new conversation
// exports.createConversation = async (req, res) => {
//   try {
//     const { users } = req.body;
//     const conversation = new Conversation({ users });
//     await conversation.save();
//     res.status(201).json({ conversation });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Get all conversations
// exports.getAllConversations = async (req, res) => {
//   try {
//     const conversations = await Conversation.find();
//     res.json({ conversations });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// conversationController.js

const Conversation = require('../models/conversations');
const friends = require('../models/friends');
const users = require('../models/users');

// Create a new conversation
exports.createConversation = async (req, res) => {
  try {
    const  users  = req.body;
    const usersArray = [...users]
    const reverserdUsersArray = usersArray.reverse()
    // console.log(usersArray.reverse())
    const existingConversation = await Conversation.findOne( {$or: [
      { users: [...users] },
      { users: reverserdUsersArray}
    ]})
    // console.log([...users])
    console.log(existingConversation)
    if (!existingConversation){
      // res.json({error: 'Conversation exists between these users'})
      const conversation = new Conversation();
      conversation.users.push(...users); // Push new user IDs into the users array
      await conversation.save();
      res.status(201).json({ conversation });
      console.log({conversation})
    }
    else{
      res.status(400).json({error: 'conversation exists'})
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
};

// Get all conversations
exports.getAllConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find();
    res.json({ conversations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getConversationsById = async (req, res) => {
  try {
    const id  = req.params.id
    // console.log(id)
    // const conversations = await Conversation.find();
    const conversations = await Conversation.find({ users: { $in: [id] } });
    const allUsers = await users.find()
    // console.log(allUsers)

    
    const conversationsWithUsernames = conversations.map( conversation => {
      // const currentUser = users.find(user => user._id.toString() === id);

      const otherUser = conversation.users.find(user => user._id.toString() !== req.user);
      // console.log(otherUser)
      const otherUserData = allUsers.find(user => user._id.toString() === otherUser.toString())
      // console.log(otherUserData)
      

      return { _id: conversation._id, userData: otherUserData ,createdAt: conversation.createdAt, updatedAt: conversation.updatedAt, __v: conversation.__v };

      // return { _id: conversation._id, userId: otherUser,username: otherUserData.username ,createdAt: conversation.createdAt, updatedAt: conversation.updatedAt, __v: conversation.__v };
    });
    
    // const friends = await friends.find({})
    // const conversations = await Conversation.find({ users: id }).lean();

    // const userIds = conversations.flatMap(conversation => conversation.users);
    // const users = await users.find({ _id: { $in: userIds } }, 'username');

    // const conversationsWithUsernames = conversations.map(conversation => {
    //   const usernames = users
    //     .filter(user => conversation.users.includes(user._id))
    //     .map(user => user.username);

    //   return { ...conversation, users: usernames };
    // });

    // console.log(conversations)

    // const userInfo = {...conversations}

    // console.log("with username",conversationsWithUsernames)
    res.json( conversationsWithUsernames );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};