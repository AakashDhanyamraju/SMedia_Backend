// friends.js
const express = require("express");
const Friend = require("../models/friends");
const User = require("../models/users");

// Get friend requests for the current user
module.exports = {

  recievedRequests: async (req, res) => {
    try {
      const friendRequests = await Friend.find({
        receiverId: req.user,
        status: "pending",
      });
      const fetchedUsers = await User.find()
      // console.log(fetchedUsers)
      const users_curr = fetchedUsers.filter(user => user._id.toString() !== req.user.toString())
      // console.log(users_curr)

      const combinedData = friendRequests.map(friend => {
        const user = users_curr.find(user => {
          if(friend.senderId.toString() === req.user.toString()){
            return user._id.toString() === friend.receiverId.toString();
          }
          return user._id.toString() === friend.senderId.toString();
        });
        const username = user ? user.username : 'Unknown';
        return {
          ...friend.toObject(),
          username: username
        };
      })
      // console.log(combinedData)
      res.json(combinedData);
      // res.json(friendRequests);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get sent friend requests by the current user
  sentRequests: async (req, res) => {
    try {
      const sentRequests = await Friend.find({
        senderId: req.user,
        status: "pending",
      });

      // const sentRequests = 
      // const foundUser = await User.findOne({_id: })
      // const user = users_curr.find(user => {
      //   if(friend.senderId.toString() === req.user.toString()){
      //     return user._id.toString() === friend.receiverId.toString();
      //   }
      //   return user._id.toString() === friend.senderId.toString();
      // });
      // const username = user ? user.username : 'Unknown';
      // return {
      //   ...friend.toObject(),
      //   username: username
      // };
      res.json(sentRequests);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get friends of the current user
  allFriends: async (req, res) => {
    try {
      // const fetchedPosts = await Post.find().sort({created_at: -1});
      //   const fetchedUsers = await User.find();
        // const combinedData = fetchedPosts.map(post => {
        //   const user = fetchedUsers.find(user => {
        //     return user._id.toString() === post.user.toString();
        //   });
        //   const username = user ? user.username : 'Unknown';
        //   return {
        //     ...post.toObject(),
        //     username: username
        //   };
      const fetchedFriends = await Friend.find({
        $or: [
          { senderId: req.user, status: "accepted" },
          { receiverId: req.user, status: "accepted" },
        ],

      });
      // console.log(fetchedFriends,req.user)



      const fetchedUsers = await User.find()
      // console.log(fetchedUsers)
      const users_curr = fetchedUsers.filter(user => user._id.toString() !== req.user.toString())
      // console.log(users_curr)

      const combinedData = fetchedFriends.map(friend => {
        const user = users_curr.find(user => {
          if(friend.senderId.toString() === req.user.toString()){
            return user._id.toString() === friend.receiverId.toString();
          }
          return user._id.toString() === friend.senderId.toString();
        });
        const username = user ? user.username : 'Unknown';
        return {
          ...friend.toObject(),
          username: username
        };
      })
      // console.log(combinedData)
      res.json(combinedData);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },


  getFriendsById: async (req, res) => {
    try {
      const userId = req.params.id
      // const fetchedPosts = await Post.find().sort({created_at: -1});
      //   const fetchedUsers = await User.find();
        // const combinedData = fetchedPosts.map(post => {
        //   const user = fetchedUsers.find(user => {
        //     return user._id.toString() === post.user.toString();
        //   });
        //   const username = user ? user.username : 'Unknown';
        //   return {
        //     ...post.toObject(),
        //     username: username
        //   };
      const fetchedFriends = await Friend.find({
        $or: [
          { senderId: userId, status: "accepted" },
          { receiverId: userId, status: "accepted" },
        ],

      });
      // console.log(fetchedFriends,req.user)



      const fetchedUsers = await User.find()
      // console.log(fetchedUsers)
      const users_curr = fetchedUsers.filter(user => user._id.toString() !== userId.toString())
      // console.log(users_curr)

      const combinedData = fetchedFriends.map(friend => {
        const user = users_curr.find(user => {
          if(friend.senderId.toString() === userId.toString()){
            return user._id.toString() === friend.receiverId.toString();
          }
          return user._id.toString() === friend.senderId.toString();
        });
        const username = user ? user.username : 'Unknown';
        return {
          ...friend.toObject(),
          username: username
        };
      })
      // console.log(combinedData)
      res.json(combinedData);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  // Send friend request
  // sendRequest: async (req, res) => {
  //   try {
  //     const { receiverId } = req.body;
  //     console.log(req.user, receiverId)
  //     const findRequest = await Friend.findOne({ senderId:req.user ,receiverId })
  //     console.log(findRequest)
  //     const newFriendRequest = new Friend({
  //       senderId: req.user,
  //       receiverId: receiverId,
  //       status: "pending",
  //     });
  //     await newFriendRequest.save();
  //     res.json({ message: "Friend request sent" });
  //   } catch (err) {
  //     res.status(500).json({ error: err.message });
  //   }
  // },
  sendRequest: async (req, res) => {
    try {
      const { receiverId } = req.body;
      console.log(req.user, receiverId);
      const findRequest = await Friend.findOne({ senderId: req.user, receiverId });
      console.log(findRequest);
  
      if (findRequest && findRequest.status !== "rejected") {
        return res.status(400).json({ error: "Friend request already sent" });
      }
  
      const newFriendRequest = new Friend({
        senderId: req.user,
        receiverId,
        status: "pending",
      });

      console.log(newFriendRequest)
      // const findRequest = await Friend.findOne(newFriendRequest);



      await newFriendRequest.save();
  
      res.json({ message: "Friend request sent" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  
  

  // Accept friend request
  acceptRequest: async (req, res) => {
    try {
      const friendRequest = await Friend.findOneAndUpdate(
        { _id: req.params.id, receiverId: req.user },
        { status: "accepted" },
        { new: true }
      );
      if (!friendRequest) {
        return res.status(404).json({ error: "Friend request not found" });
      }
      res.json({ message: "Friend request accepted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Reject friend request
  rejectRequest: async (req, res) => {
    try {
      const friendRequest = await Friend.findOneAndUpdate(
        { _id: req.params.id, receiverId: req.user },
        { status: "rejected" },
        { new: true }
      );
      if (!friendRequest) {
        return res.status(404).json({ error: "Friend request not found" });
      }
      res.json({ message: "Friend request rejected" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
