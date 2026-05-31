// // server.js
// import express from 'express'
// import cors from 'cors'
// import 'dotenv/config';
//
// // import dotenv from "dotenv";
// // dotenv.config();   // must be first! // ⬅ Load environment variables // no path needed
//
//
// // older ways const require
// // modern ways import export
//
// import connectDB from './configs/db.js'; // ⬅ Must include .js extension in ESM
//
// import { inngest, functions } from "./inngest/index.js"
// import {serve} from 'inngest/express'
// import { clerkMiddleware } from '@clerk/express'
// import userRouter from './routes/userRoute.js';
// import postRouter from './routes/postRoute.js';
// import storyRouter from './routes/storyRoute.js';
// import messageRouter from './routes/messageRoute.js';
// import commentRouter from "./routes/commentRoutes.js";
//
//
// const app=express();
// const PORT=process.env.PORT || 4000;
//
//
// // middlewares
// app.use(express.json());
// app.use(cors());
// app.use(express.urlencoded({extended:true}));
// app.use(clerkMiddleware())
//
//
//
// // Connect DB
// await connectDB();
//
//
// app.get('/',(req,res)=>{
//   res.send("Server is Working");
// })
// // Set up the "/api/inngest" (recommended) routes with the serve handler
// app.use("/api/inngest", serve({ client: inngest, functions }));
// app.use('/api/user',userRouter);
// app.use('/api/post',postRouter);
// app.use('/api/story',storyRouter);
// app.use('/api/message',messageRouter);
// app.use("/api/comment", commentRouter);
//
// app.listen(PORT,()=>{
//   console.log(`Server is running on port :http://localhost:${PORT}`)
// })
//



// server.js
import express from 'express'
import cors from 'cors'
import 'dotenv/config';

// import dotenv from "dotenv";
// dotenv.config();   // must be first! // ⬅ Load environment variables // no path needed


// older ways const require
// modern ways import export

import http from "http";
import { Server } from "socket.io";

import connectDB from './configs/db.js'; // ⬅ Must include .js extension in ESM

import { inngest, functions } from "./inngest/index.js"
import { serve } from 'inngest/express'
import { clerkMiddleware } from '@clerk/express'
import userRouter from './routes/userRoute.js';
import postRouter from './routes/postRoute.js';
import storyRouter from './routes/storyRoute.js';
import messageRouter from './routes/messageRoute.js';
import commentRouter from "./routes/commentRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Create HTTP server for Socket.IO
const server = http.createServer(app);

// Socket.IO setup
export const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      process.env.CLIENT_URL
    ],
    credentials: true,
  }
});

// Store connected users
export const userSocketMap = {};

// Socket.IO connection
io.on("connection", (socket) => {

  console.log("✅ User Connected:", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // Send online users to everyone
  io.emit("onlineUsers", Object.keys(userSocketMap));

  // Typing indicator
  socket.on("typing", ({ receiverId, senderId }) => {

    const receiverSocketId =
        userSocketMap[receiverId];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit(
          "userTyping",
          senderId
      );
    }
  });

  // Stop typing indicator
  socket.on("stopTyping", ({ receiverId, senderId }) => {

    const receiverSocketId =
        userSocketMap[receiverId];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit(
          "userStoppedTyping",
          senderId
      );
    }
  });

  // Disconnect
  socket.on("disconnect", () => {

    console.log("❌ User Disconnected:", socket.id);

    if (userId) {
      delete userSocketMap[userId];
    }

    io.emit("onlineUsers", Object.keys(userSocketMap));
  });

});

// middlewares
app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:5173",
    process.env.CLIENT_URL
  ],
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware())


// Connect DB
await connectDB();


app.get('/', (req, res) => {
  res.send("Server is Working");
})

// Set up the "/api/inngest" (recommended) routes with the serve handler
app.use("/api/inngest", serve({ client: inngest, functions }));

app.use('/api/user', userRouter);
app.use('/api/post', postRouter);
app.use('/api/story', storyRouter);
app.use('/api/message', messageRouter);
app.use("/api/comment", commentRouter);

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port :http://localhost:${PORT}`)
})