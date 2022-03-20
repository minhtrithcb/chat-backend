require("dotenv").config();

module.exports = {
    DB_USERNAME:    process.env.DB_USERNAME,
    DB_PASSWORD:    process.env.DB_PASSWORD,
    DB_CLUSTER:     process.env.DB_CLUSTER,
    DB_COLLECTION:  process.env.DB_COLLECTION,
    PORT:           process.env.PORT,
    A_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    R_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET
}