const FriendReqController = require("../controller/FriendReqController");
const router = require("express").Router();

// Route get friend request by sender
router.get("/friend-request/:sender", FriendReqController.getFriendReq)

// Route get accept friend request by reciver
router.get("/accept-friend-request/:reciver", FriendReqController.getAcceptFriendReq)

// Route post reciver accept friend request
router.post("/accept-friend-request", FriendReqController.acceptFriendReq)

// Route post create friend request
router.post("/create-friend-request", FriendReqController.createFriendReqs)

// Route post unsend friend request
router.post("/unsend-friend-request", FriendReqController.unSendFriendReq)


module.exports = router