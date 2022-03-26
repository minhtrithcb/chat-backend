const ChatController = require("../controller/ChatController");
const router = require("express").Router();

// Route Chat
router.post("/", ChatController.post)

// Route Get all chat by room
router.get("/:roomId", ChatController.get)


module.exports = router