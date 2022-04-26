const UserController = require("../controller/UserController");
const router = require("express").Router();

// Route get all users
router.get("/", UserController.getUsers)

// Route get friend user by id
router.get("/friend/:id", UserController.getFriendUser)

// Route post search find user by fullname or email
router.post("/search", UserController.searchUser)

// Route get user by id
router.get("/:userId", UserController.getUser)

// Route post unfriend
router.post("/unfrined", UserController.unFriend)


module.exports = router