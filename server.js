const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const {PORT} = require("./config/env.config.js")
const app = express()
const routerInit = require("./routers")
const connectDB = require('./DB/connectDB.js')
const cookieParser = require('cookie-parser')
const socketIo = require('./socket')
const http = socketIo(app)
app.use(morgan('dev'))
app.use(express.json());

app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PATCH"],
    credentials: true
}));

app.use(cookieParser());
// CONNECT MONGODB
connectDB();

// ROUTER INIT
routerInit(app);


http.listen(PORT, () => {
    console.log(`Server chạy ở cổng ${PORT}`)
})