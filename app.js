// app.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/users');
const cors = require('cors');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
var cookieParser = require('cookie-parser');
const Message = require('./models/messages')

const http = require('http');


const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);



// Socket.io event handling
io.on('connection', (socket) => {
  // Handle message sending event
  socket.on('send_message', async (data) => {
    try {
      // Save the message to MongoDB
      const { sender, receiver, content } = data;
      const message = new Message({ sender, receiver, content });
      await message.save();

      // Emit the message to the recipient
      io.to(receiver).emit('receive_message', message);
    } catch (error) {
      console.error(error);
    }
  });
});



// Connect to MongoDB
mongoose.connect('mongodb+srv://aakashdhanyamraju425:jTwl5bdUSsuQpYi4@aakashcluster1.h1scfqq.mongodb.net/socialmediadb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB', error);
  });

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors())


// Function to generate JWT token
function generateToken(user) {
    return jwt.sign({ id: user.id, username: user.username }, 'secret', { expiresIn: '3h' });
}
  
  // Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
    // Get the token from the request headers
    // console.log(req)
    const token = req.headers.authorization?.split(' ')[1];
  
    // If no token is found, return an unauthorized response
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    try {
      // Verify the token using the secret key
      const decoded = jwt.verify(token, 'secret');
  
      // Attach the user information to the request object
      req.user = decoded.id;
  
      // Move to the next middleware or route handler
      next();
    } catch (error) {
      // Handle token verification errors
      res.status(403).json({ error: 'Invalid token' });
    }
}

  
// Routes
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');
const friendRoutes = require('./routes/friend');
const messageRoutes = require('./routes/message');
const conversationRoutes = require('./routes/conversation');


app.post('/chat', async (req, res) => {
  try {
    const { sender, receiver, content } = req.body;

    // Save the message to MongoDB
    const message = new Message({ sender, receiver, content });
    await message.save();

    // Emit the message to the recipient
    io.to(receiver).emit('receive_message', message);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});
app.use('/users', authenticateToken, userRoutes);
app.use('/posts', authenticateToken, postRoutes);
app.use('/comments', authenticateToken, commentRoutes);
app.use('/friends', authenticateToken, friendRoutes);
app.use('/conversations', authenticateToken, conversationRoutes)
app.use('/messages', authenticateToken, messageRoutes)





// User registration route
app.post('/register', async (req, res) => {
    try {
      // Extract the user data from the request body
      
      const { username, email, password } = req.body;
      const existingUsername =  await User.findOne({ username });
      const existingEmail =  await User.findOne({ email });

      if(existingEmail){
        return res.status(400).json({message: 'Email Exists'})
      }

      if(existingUsername){
        return res.status(400).json({message: 'Username Exists'})
      }


  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Save the user to the database
      // Replace 'User' with your user model
      const user = new User({ username, password: hashedPassword, email, status: 'active' });
      const savedUser = await user.save()
      // console.log("user",user)
      // console.log("saveduser",savedUser)

  
      // Generate a JWT token
      const token = generateToken(user);
      
      res.cookie('currentUser', token)

      // Respond with the token
      res.json({ token });
    } catch (error) {
      // Handle registration errors
      res.status(500).json({ error: `the error is: ${error}` });
    }
  });
  
  // User login route
  app.post('/login', async (req, res) => {
    try {
      // Extract the user data from the request body
      const { username, password } = req.body;
      console.log(username, password)
  
      // Find the user in the database
      // Replace 'User' with your user model
      const user = await User.findOne({ username });
      console.log("user", user)
      const userId = user._id

      


  
      // If the user is not found, respond with an error
      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }


  
      // Compare the provided password with the stored hashed password
      const passwordMatch = await bcrypt.compare(password, user.password);
    //   if(bcrypt.compareSync(req.body.password, findUser.password)){

    //     const token = generateToken(findUser._id)
    //     res.status(200).json({message: 'Login'})

    // }else{
    //   return res.status(404).json({ message: "password not Matching" })
    // }
  
      // If the passwords don't match, respond with an error
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
      const updatingStatus = await User.findByIdAndUpdate({ _id: userId }, { status: 'active' }, { new: true });
      // Generate a JWT token
      const token = generateToken(user);
      res.cookie('currentUser', token)
      // Respond with the token
      res.json({ token });
    } catch (error) {
      // Handle login errors
      res.status(500).json({ error: 'An error occurred during login' });
    }
  });

  // app.post('/logout', async(req, res) => {
  //   try{
  //     console.log("TEST THIS SHIT", req.user)
  //     const cookie = req.cookies.currentUser
  //     console.log('cookie', cookie)
  //     await User.findByIdAndUpdate({ _id: req.user }, { status: 'inactive' }, { new: true });
  //     // Remove the token from local storage
  //     localStorage.removeItem('token');
  //     res.cookie('currentUser', '', {maxAge: 1})
  //     // res.redirect('/')
  //     // Respond with a success message
  //     res.json({ message: 'Logged out successfully' });
  //   }
  //   catch(err){
  //     res.status(500).json({error:  err})
  //   }
    
  // });


// Start the server
const port = 9000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
