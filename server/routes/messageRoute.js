// import express from "express";
// import {
//   deleteForEveryone,
//   deleteForMe,
//   editMessage,
//   getChatMessages,
//   sendMessage,
//   sseController,
// } from "../controllers/messageController.js";
// import { protect } from "../middlewares/auth.js";
// import upload from "../configs/multer.js";
//
// const messageRouter = express.Router();
//
// messageRouter.get("/:userId", sseController);
// messageRouter.post("/send", upload.single("media"), protect, sendMessage);
// messageRouter.post("/get", protect, getChatMessages);
// messageRouter.put("/:id/edit", protect, editMessage);      // fixed
// // messageRouter.js
// messageRouter.delete("/:id/me", protect, deleteForMe);
// messageRouter.delete("/:id/everyone", protect, deleteForEveryone);
//
//
// export default messageRouter;




import express from "express";
import {
  deleteForEveryone,
  deleteForMe,
  editMessage,
  getChatMessages,
  sendMessage,
  getUserRecentMessages,
} from "../controllers/messageController.js";

import { protect } from "../middlewares/auth.js";
import upload from "../configs/multer.js";

const messageRouter = express.Router();

// Send Message
messageRouter.post(
    "/send",
    upload.single("media"),
    protect,
    sendMessage
);

// Get Chat Messages
messageRouter.post(
    "/get",
    protect,
    getChatMessages
);

// Get Recent Messages
messageRouter.get(
    "/recent",
    protect,
    getUserRecentMessages
);

// Edit Message
messageRouter.put(
    "/:id/edit",
    protect,
    editMessage
);

// Delete Message For Me
messageRouter.delete(
    "/:id/me",
    protect,
    deleteForMe
);

// Delete Message For Everyone
messageRouter.delete(
    "/:id/everyone",
    protect,
    deleteForEveryone
);

export default messageRouter;