const bcrypt = require('bcrypt');
const User = require("../models/user")
const {A_TOKEN_SECRET, R_TOKEN_SECRET} = require("../config/env.config")
const jwt = require("jsonwebtoken")

const AuthController = {
   
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

    async accessToken (req, res) {
        if (req.cookies.accessToken) {
            let accessTK  = req.cookies.accessToken
            // Check Token
            jwt.verify(accessTK, A_TOKEN_SECRET, (err, data) => {
                if (err) {
                    res.clearCookie('accessToken');
                    return res.status(401).json({isLogin: false })
                } else {
                    return res.json({isLogin: true , accessToken: accessTK})
                }
            })
        } else {
            return res.json({isLogin: false })
        }
    },

    async refreshToken (req, res) {
        if (req.cookies.refreshToken) {
            const refreshTk = req.cookies.refreshToken
            
            jwt.verify(refreshTk, R_TOKEN_SECRET, (err, data) => {
                if (err) {
                    res.clearCookie('refreshToken');
                    return res.status(403).json({isLogin: false })
                } else {        
                    // console.log(data);
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

    async logout (req,res) {
        if (req.cookies.accessToken && req.cookies.refreshToken) {
            // xóa cookie
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');

            return res.json({isLogin: false , msg: "Đăng xuất thành công"})
        } else {
        return res.json({success: false, msg: "Lỗi"})
        }
    },

    async login (req, res) {
        let user = await User.findOne({ email: req.body.email })
        .select("_id fullname password")
        // Check accout tồn tại
        if (!user) return res.json({success: false, msg: "Không tìm thấy tài khoản này"})
        // Check mật khẩu
        const passValid = await bcrypt.compare(req.body.password , user.password)
        if (!passValid) return res.send({success: false, msg: "Sai mật khẩu"})

        // Tạo accessToken 
        const accessToken = jwt.sign({ username: user.fullname, id : user._id}, A_TOKEN_SECRET, { expiresIn: '10m' })
        
        // Tạo accessToken 
        const refreshToken = jwt.sign({ username: user.fullname, id : user._id}, R_TOKEN_SECRET, { expiresIn: '1d' })
        
        // Tạo cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 
        });
        
        return res.json({success: true, isLogin: true , accessToken, msg: "Đăng nhập thành công"})
    }
}

module.exports = AuthController