const jwt = require('jsonwebtoken');
const { A_TOKEN_SECRET } = require('../config/env.config');

const authMiddleware = (req, res, next) => {
    if (req.cookies.accessToken) {
        let accessTK  = req.cookies.accessToken
        // Check if acessTk have error delete cookies else next the request
        jwt.verify(accessTK, A_TOKEN_SECRET, (err, data) => {
            if (err) {
                res.clearCookie('accessToken');
                return res.status(401).json({isLogin: false, err})
            } else next()
        })
    } else {
        return res.status(401).json({isLogin: false })
    }

}

module.exports = authMiddleware