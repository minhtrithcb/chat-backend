const authMiddleware = require('../middleware/auth');
const authRoute = require('./authRoute')
const userRoute = require('./userRoute')
const chatRoute = require('./chatRoute')
const friendReqRoute = require('./friendReqRoute')
const conversationRoute = require('./conversationRoute')

function routerInit(app) {
     // router for Auth
     app.use("/api/auth", authRoute);
     
     // router for user
     app.use("/api/user", userRoute);
     
     // router for conversation (room)
     app.use("/api/conversation", conversationRoute);
     
     // router for Friend Request
     app.use("/api/friendReq", friendReqRoute);
     
     // router For chat 
     app.use("/api/chat", chatRoute);
}

module.exports = routerInit