const ChatController = require("../controller/ChatController");
const router = require("express").Router();

// Route Post create new chat
router.post("/", ChatController.post)

// 
router.post("/reaction", ChatController.addReacts)

// Route Get all chat by roomId (ConvertationId)
router.get("/:roomId", ChatController.get)


module.exports = router