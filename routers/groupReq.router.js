const GroupReqController = require("../controller/GroupReqController");
const router = require("express").Router();

// Route get group request by sender
router.get("/group-request/:sender", GroupReqController.getGroupReq)

// Route get accept group request by reciver
router.get("/accept-group-request/:reciver", GroupReqController.getAcceptGroupReq)

// Route post reciver accept group request
router.post("/accept-group-request", GroupReqController.acceptGroupReq)

// Route post accept group public request
router.post("/accept-group-public", GroupReqController.acceptGroupPublic)

// Route post create group request
router.post("/create-group-request", GroupReqController.createGroupReqs)

// Route post unsend group request
router.post("/unsend-group-request", GroupReqController.unSendGroupReq)


module.exports = router