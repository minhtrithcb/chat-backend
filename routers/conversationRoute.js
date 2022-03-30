const ConversationController = require("../controller/ConversationController");
const router = require("express").Router();

// Route Post room
router.post("/", ConversationController.post)

// Route Get last message by roomId
router.get("/lastMsg/:roomId", ConversationController.lastMsg)

// Route Get room
router.get("/:userId", ConversationController.get)





module.exports = router