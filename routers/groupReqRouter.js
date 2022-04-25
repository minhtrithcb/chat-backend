const GroupReqController = require("../controller/GroupReqController");
const router = require("express").Router();

// Route get friend request by sender
router.get("/friend-request/:sender", GroupReqController.getFriendReq)

// Route get accept friend request by reciver
router.get("/accept-friend-request/:reciver", GroupReqController.getAcceptFriendReq)

// Route post reciver accept friend request
router.post("/accept-friend-request", GroupReqController.acceptFriendReq)

// Route post create friend request
router.post("/create-friend-request", GroupReqController.createFriendReqs)

// Route post unsend friend request
router.post("/unsend-friend-request", GroupReqController.unSendFriendReq)


module.exports = router