const UserController = require("../controller/UserController");
const router = require("express").Router();

// Route get all users
router.get("/", UserController.getUsers)

// Route get user by id
router.get("/:userId", UserController.getUser)


module.exports = router