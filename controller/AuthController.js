const bcrypt = require('bcrypt');
const User = require("../models/user")
const {A_TOKEN_SECRET, R_TOKEN_SECRET} = require("../config/env.config")
const jwt = require("jsonwebtoken")

const AuthController = {
   
    // Post Sign up => email Check if exist & hash pass 
    async signup (req, res) {

        // Check email tồn tại
        const emailExi = await User.findOne({email: req.body.email})
        if (emailExi) return res.json({success: false, msg :"Email đã tồn tại"})

        // // Hash password
        const hashPass = await bcrypt.hash(req.body.password, 10)

        User.create({
            fullname: req.body.fullname,
            password: hashPass,
            email: req.body.email,
        }).then(() => {
            return res.json({
                success: true,
                msg: "Tạo Tài khoản thành công"
            })
        }).catch(err => {
            return res.json({
                success: false,
                msg: err
            })
        })
    },

    // Get new accessToken 
    async accessToken (req, res) {
        // If user have accessToken 
        if (req.cookies.accessToken) {
            let accessTK  = req.cookies.accessToken
            // Check Token if(expire or strangeCode) ? delete accestTK : sent back nothing 
            jwt.verify(accessTK, A_TOKEN_SECRET, (err, data) => {
                if (err) {
                    res.clearCookie('accessToken');
                    return res.status(401).json({isLogin: false })
                } else {
                    return res.json({isLogin: true , accessToken: accessTK})
                }
            })
        // If user dont have accessToken but have refreshTK 
        } else if (req.cookies.refreshToken) {
            const refreshTk = req.cookies.refreshToken
            // Check Token if(expire or strangeCode) ? delete refreshTk send Login fail: create new accestTk
            jwt.verify(refreshTk, R_TOKEN_SECRET, (err, data) => {
                if (err) {
                    res.clearCookie('refreshToken');
                    return res.status(403).json({isLogin: false })
                } else {        
                    // Create new accestTk & send back
                    const accessToken = jwt.sign({ username: data.username, id : data.id}, A_TOKEN_SECRET, { expiresIn: '10m' })
                    res.cookie('accessToken', accessToken, {
                        httpOnly: true
                    });
                    return res.json({isLogin: true , accessToken})
                }
            })
        } else {
            return res.json({isLogin: false })
        } 
    },

    // Get new refreshToken 
    async refreshToken (req, res) {
        // If user have refreshTK 
        if (req.cookies.refreshToken) {
            const refreshTk = req.cookies.refreshToken
            // Check Token if(expire or strangeCode) ? delete refreshTk send Login fail: create new accestTk
            jwt.verify(refreshTk, R_TOKEN_SECRET, (err, data) => {
                if (err) {
                    res.clearCookie('refreshToken');
                    return res.status(403).json({isLogin: false })
                } else {        
                    // Create new accestTk & send back
                    const accessToken = jwt.sign({ username: data.username, id : data.id}, A_TOKEN_SECRET, { expiresIn: '10m' })
                    res.cookie('accessToken', accessToken, {
                        httpOnly: true
                    });
                    return res.json({isLogin: true , accessToken})
                }
            })
        } else {
            return res.json({isLogin: false , msg: "dont try that :(("})
        }
    },

    // Post logout just delete two cookie refreshToken & accessToken
    async logout (req,res) {
        if (req.cookies.accessToken && req.cookies.refreshToken) {
            // delete cookie
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');

            return res.json({isLogin: false , msg: "Đăng xuất thành công"})
        } else {
        return res.json({success: false, msg: "Lỗi"})
        }
    },

    // Post user Login 
    async login (req, res) {
        let user = await User.findOne({ email: req.body.email })
        .select("_id fullname password")
        // Check account exist
        if (!user) return res.json({success: false, msg: "Không tìm thấy tài khoản này"})
        // Check password
        const passValid = await bcrypt.compare(req.body.password , user.password)
        if (!passValid) return res.send({success: false, msg: "Sai mật khẩu"})

        // Create accessToken 
        const accessToken = jwt.sign({ username: user.fullname, id : user._id}, A_TOKEN_SECRET, { expiresIn: '10m' })
        
        // Create accessToken 
        const refreshToken = jwt.sign({ username: user.fullname, id : user._id}, R_TOKEN_SECRET, { expiresIn: '1d' })
        
        // Create cookies accessToken
        res.cookie('accessToken', accessToken, {
            httpOnly: true
        });

        // Create cookie refreshToken expiresIn One day
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 
        });
        // Sent back to user
        return res.json({success: true, isLogin: true , accessToken, msg: "Đăng nhập thành công"})
    }
}

module.exports = AuthController