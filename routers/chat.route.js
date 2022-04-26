const ChatController = require("../controller/ChatController");
const router = require("express").Router();

// Route Post create new chat
router.post("/", ChatController.post)

// Route Patch a chat
router.patch("/", ChatController.patch)

// Route Post reCall (hide chat)
router.post("/reCall", ChatController.reCall)

// Route Post reCall (hide chat)
router.post("/reply", ChatController.reply)

// Route Post reaction
router.post("/reaction", ChatController.addReacts)

// Route Get all chat by roomId (ConvertationId)
router.get("/:roomId/:skip", ChatController.get)


module.exports = router