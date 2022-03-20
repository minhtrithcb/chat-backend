const UserController = require("../controller/UserController");
const router = require("express").Router();

// Route Đăng nhập
router.get("/", UserController.getUsers)


module.exports = router