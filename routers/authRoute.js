const AuthController = require("../controller/AuthController");
const router = require("express").Router();

// Route Đăng nhập
router.post("/login", AuthController.login)

// Route Đăng ký
router.post("/signup", AuthController.signup)

// Route access Token
router.get("/accessToken", AuthController.accessToken)

// Route refresh Token
router.get("/refreshToken", AuthController.refreshToken)



module.exports = router