const ConversationController = require("../controller/ConversationController");
const router = require("express").Router();

// Route Post create new Conversation 
router.post("/", ConversationController.post)

// Post delete a Conversation => then delete all chat of this conversation
router.post("/delete", ConversationController.delete)

// Route Get the last message by roomId
router.get("/lastMsg/:roomId", ConversationController.lastMsg)

// Route Get All Conversation by userId
router.get("/:userId", ConversationController.get)


module.exports = router