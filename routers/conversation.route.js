const ConversationController = require("../controller/ConversationController");
const router = require("express").Router();


// Route Get Conversation by userId
router.post("/get", ConversationController.get)

// Get all unRead conversation
router.get("/getCountUnReadMsg/:userId", ConversationController.getCountUnReadMsg)

// Route Get One Conversation by userId
router.post("/getOne", ConversationController.getOne)

// Route Post create new Conversation 
router.post("/postFriend", ConversationController.postFriend)

// Post to user Read Msg
router.post("/postReadMsg", ConversationController.postReadMsg)

// Post to user UnRead Msg
router.post("/postUnReadMsg", ConversationController.postUnReadMsg)

// Route Post create group Conversation 
router.post("/postGroup", ConversationController.postGroup)

// Post delete a Conversation => then delete all chat of this conversation
router.post("/delete", ConversationController.delete)

// Route Get the last message by roomId
router.get("/lastMsg/:roomId", ConversationController.lastMsg)


module.exports = router