const FriendReqController = require("../controller/FriendReqController");
const router = require("express").Router();

// Route post
router.get("/friend-request/:sender", FriendReqController.getFriendReq)

// Route post
router.get("/accept-friend-request/:reciver", FriendReqController.getAcceptFriendReq)

// Route post
router.post("/accept-friend-request", FriendReqController.acceptFriendReq)

// Route post
router.post("/create-friend-request", FriendReqController.createFriendReqs)

// Route get all user search fullname
router.post("/unsend-friend-request", FriendReqController.unSendFriendReq)


module.exports = router