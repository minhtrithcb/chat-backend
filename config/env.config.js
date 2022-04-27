require("dotenv").config();

module.exports = {
    DB_USERNAME:    process.env.DB_USERNAME,
    DB_PASSWORD:    process.env.DB_PASSWORD,
    DB_CLUSTER:     process.env.DB_CLUSTER,
    DB_COLLECTION:  process.env.DB_COLLECTION,
    PORT:           process.env.PORT,
    A_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    R_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    GMAIL_EMAIL:    process.env.GMAIL_EMAIL,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
    CLIENT_SITE:    process.env.CLIENT_SITE,
    RESET_PASSWORD: process.env.RESET_PASSWORD,
}