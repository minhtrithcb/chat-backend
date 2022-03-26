const authMiddleware = require('../middleware/auth');
const authRoute = require('./authRoute')
const userRoute = require('./userRoute')
const chatRoute = require('./chatRoute')
const conversationRoute = require('./conversationRoute')

function routerInit(app) {
     // router Liên quan bảo mật
     app.use("/api/auth", authRoute);
     
     // router Liên quan user
     app.use("/api/user", userRoute);
     
     // router Liên quan room
     app.use("/api/conversation", conversationRoute);
     
     // router Liên quan chat
     app.use("/api/chat", chatRoute);
}

module.exports = routerInit