const authMiddleware = require('../middleware/auth');
const authRoute = require('./auth.route')
const userRoute = require('./user.route')
const chatRoute = require('./chat.route')
const friendReqRoute = require('./friendReq.route')
const conversationRoute = require('./conversation.route')

function routerInit(app) {
     // router for Auth
     app.use("/api/auth", authRoute);
     
     // router for user
     app.use("/api/user", authMiddleware, userRoute);
     
     // router for conversation (room)
     app.use("/api/conversation", authMiddleware, conversationRoute);
     
     // router for Friend Request
     app.use("/api/friendReq", authMiddleware, friendReqRoute);
     
     // router For chat 
     app.use("/api/chat", authMiddleware, chatRoute);
}

module.exports = routerInit