const mongoose = require('mongoose'); 
const {DB_USERNAME, DB_PASSWORD, DB_CLUSTER, DB_COLLECTION} = require('../config/env.config');

const URL = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_CLUSTER}.p5nao.mongodb.net/${DB_COLLECTION}?retryWrites=true&w=majority`

const connectDB = async () => {
    try {
        await mongoose.connect(URL,{ useNewUrlParser: true ,  useUnifiedTopology: true})
        console.log("Kết nối database thành công");
    } catch (error) {
        console.error("Đã có lỗi xảy ra: ", error)
    }
}

module.exports = connectDB