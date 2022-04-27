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

// Route post send veritfy
router.post("/send-verify", AuthController.sendVerify)

// Route post check veritfy
router.post("/check-verify", AuthController.checkVerifyOTP)

// Route post check token
router.post("/check-token-reset-pass", AuthController.checkValidResetPass)

// Route post reset password
router.post("/reset-password", AuthController.resetPassword)

module.exports = router