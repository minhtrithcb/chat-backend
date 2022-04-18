const ConversationController = require("../controller/ConversationController");
const router = require("express").Router();


// Route Get Conversation by userId
router.post("/get", ConversationController.get)

// Route Get One Conversation by userId
router.post("/getOne", ConversationController.getOne)

// Route Post create new Conversation 
router.post("/postFriend", ConversationController.postFriend)

// Route Post create group Conversation 
router.post("/postGroup", ConversationController.postGroup)

// Post delete a Conversation => then delete all chat of this conversation
router.post("/delete", ConversationController.delete)

// Route Get the last message by roomId
router.get("/lastMsg/:roomId", ConversationController.lastMsg)


module.exports = router