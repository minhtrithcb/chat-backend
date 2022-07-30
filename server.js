const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const { PORT } = require('./config/env.config.js')
const app = express()
const routerInit = require('./routers')
const connectDB = require('./DB/connectDB.js')
const cookieParser = require('cookie-parser')
const socketIo = require('./socket')
const http = socketIo(app)
app.use(morgan('dev'))
app.use(express.json())

const envDev = process.env.NODE_ENV.trim() === 'development'
const productionServer = ['https://minhtrichat.tk']
const testServer = ['http://localhost:3000']

app.use(
	cors({
		origin: envDev ? testServer : productionServer,
		methods: ['GET', 'POST', 'PATCH'],
		credentials: true,
	})
)

app.set('trust proxy', 1)

app.use(cookieParser())

// CONNECT MONGODB
connectDB()

// ROUTER INIT
routerInit(app)

http.listen(PORT, () => {
	console.log(`Server chạy ở cổng  ${PORT}`)
})
