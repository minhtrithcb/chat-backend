const jwt = require('jsonwebtoken');
const { A_TOKEN_SECRET } = require('../config/env.config');


const authMiddleware = (req, res, next) => {
    const header = req.headers['authorization']
    const token = header && header.split(" ")[1]

    if (!token) return res.sendStatus(401)

    jwt.verify(token, A_TOKEN_SECRET, (err, data) => {
        if (err) return res.sendStatus(401)
        req.uid = data._id
        next()
    })
}


module.exports = authMiddleware