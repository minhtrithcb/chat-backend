const AuthController = require("../controller/AuthController");
const router = require("express").Router();

// Route Post Login
router.post("/login", AuthController.login)

// Route Post Sign up
router.post("/signup", AuthController.signup)

// Route Post Log out
router.post("/logout", AuthController.logout)

// Route Get access Token
router.get("/accessToken", AuthController.accessToken)

// Route Get refresh Token
router.get("/refreshToken", AuthController.refreshToken)

// Route post forgot password
router.post("/forgotPassword", AuthController.forgotPassword)

// Route post forgot password
router.post("/verify", AuthController.verify)

module.exports = router