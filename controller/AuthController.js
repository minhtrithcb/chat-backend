const bcrypt = require('bcrypt');
const User = require("../models/user")
const {A_TOKEN_SECRET, R_TOKEN_SECRET, GMAIL_PASSWORD, GMAIL_EMAIL} = require("../config/env.config")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer");

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

    // Get new accessToken (When user frist load web used old accessTk or get New accessTk by RefreshTK
    async accessToken (req, res) {
        // If user have accessToken 
        if (req.cookies.accessToken) {
            let accessTK  = req.cookies.accessToken
            // Check Token if(expire or strangeCode) ? delete accestTK : sent back nothing 
            jwt.verify(accessTK, A_TOKEN_SECRET, (err, data) => {
                if (err) {
                    res.clearCookie('accessToken');
                    return res.status(401).json({isLogin: false})
                } else {
                    return res.json({isLogin: true , accessToken: accessTK})
                }
            })
        // 
        } else if (req.cookies.refreshToken) {
            const refreshTk = req.cookies.refreshToken
            // Check Token if(expire or strangeCode) ? delete refreshTk send Login fail: create new accestTk
            jwt.verify(refreshTk, R_TOKEN_SECRET, (err, data) => {
                if (err) {
                    res.clearCookie('refreshToken');
                    return res.status(403).json({isLogin: false })
                } else {        
                    // Create new accestTk & send back
                    const accessToken = jwt.sign({ username: data.username, id : data.id}, A_TOKEN_SECRET, { expiresIn: '1h' })
                    res.cookie('accessToken', accessToken, {
                        httpOnly: true
                    });
                    return res.json({isLogin: true , accessToken})
                }
            })
        }
        else {
            return res.json({isLogin: false })
        } 
    },

    // Get new accestTk by refreshToken 
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
                    const accessToken = jwt.sign({ username: data.username, id : data.id}, A_TOKEN_SECRET, { expiresIn: '1h' })
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
        .select("_id fullname password isVerifi email")
        // Check account exist
        if (!user) return res.json({success: false, msg: "Không tìm thấy tài khoản này"})

        if (user && !user?.isVerifi) return res.json({success: false, isVerifi: false, email: user.email, msg: "Tài khoản này chưa xác thực"})
        // Check password
        const passValid = await bcrypt.compare(req.body.password , user.password)
        if (!passValid) return res.send({success: false, msg: "Sai mật khẩu"})

        // Create accessToken 
        const accessToken = jwt.sign({ username: user.fullname, id : user._id}, A_TOKEN_SECRET, { expiresIn: '1h' })
        
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
    },

    async verify (req, res) {
        // const transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     host: 'smtp.gmail.com',
        //     auth: {
        //         user: GMAIL_EMAIL, 
        //         pass: GMAIL_PASSWORD, 
        //     },
        // });

        // const res = await transporter.sendMail({
        //     from: req.body.email, // sender address
        //     to: GMAIL_EMAIL, // list of receivers
        //     subject: "Hello ✔", // Subject line
        //     text: "Hello world?", // plain text body
        //     html: "<b>Hello world?</b>", // html body
        // });


    },

    // Post request forgot password
    async forgotPassword (req, res) {
        let email = req.body.email
        let user = await User.findOne({ email })
        if (!user?.isVerifi) return res.json({success: false})

        return res.json({success: true})
    }
}

module.exports = AuthController