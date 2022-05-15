const bcrypt = require('bcrypt');
const User = require("../models/user")
const verifyOtp = require("../models/verifyOtp")
const {A_TOKEN_SECRET, R_TOKEN_SECRET, GMAIL_EMAIL, RESET_PASSWORD, CLIENT_SITE} = require("../config/env.config")
const transporter = require("../config/nodeMail.config")
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

    // Get new accessToken (When user frist load web used old accessTk or get New accessTk by RefreshTK
    async accessToken (req, res) {
        // If user have accessToken 
        if (req.cookies.accessToken) {
            let accessTK  = req.cookies.accessToken
            // Check Token if(expire or strangeCode) ? delete accestTK : sent back nothing 
            jwt.verify(accessTK, A_TOKEN_SECRET, (err, data) => {
                if (err) {
                    res.cookie('accessToken', '', {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none' ,
                        maxAge: Date.now()
                    });
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
                    rres.cookie('refreshToken', '', {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none' ,
                        maxAge: Date.now()
                    });
                    return res.status(403).json({isLogin: false })
                } else {        
                    // Create new accestTk & send back
                    const accessToken = jwt.sign({ username: data.username, id : data.id}, A_TOKEN_SECRET, { expiresIn: '1h' })
                    res.cookie('accessToken', accessToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none' ,
                        // domain: ".lighthearted-mandazi-b4952c.netlify.app",
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
                    res.cookie('refreshToken', '', {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none' ,
                        maxAge: Date.now()
                    });
                    return res.status(403).json({isLogin: false })
                } else {        
                    // Create new accestTk & send back
                    const accessToken = jwt.sign({ username: data.username, id : data.id}, A_TOKEN_SECRET, { expiresIn: '1h' })
                    res.cookie('accessToken', accessToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none',
                        // domain: ".lighthearted-mandazi-b4952c.netlify.app"
                    });
                    return res.json({isLogin: true , accessToken})
                }
            })
        } else {
            return res.json({isLogin: false , reload: true, msg: "dont try that :(("})
        }
    },

    // Post logout just delete two cookie refreshToken & accessToken
    async logout (req,res) {
        if (req.cookies.accessToken && req.cookies.refreshToken) {
            // delete cookie by set this to empty and expire now
            res.cookie('accessToken', '', {
                httpOnly: true,
                secure: true,
                sameSite: 'none' ,
                maxAge: Date.now()
            });

            res.cookie('refreshToken', '', {
                httpOnly: true,
                secure: true,
                sameSite: 'none' ,
                maxAge: Date.now()
            });

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
            httpOnly: true,
            secure: true,
            sameSite: 'none' ,
            // domain: ".lighthearted-mandazi-b4952c.netlify.app"
        });

        // Create cookie refreshToken expiresIn One day
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 ,
            secure: true,
            sameSite: 'none' ,
            // domain: ".lighthearted-mandazi-b4952c.netlify.app"
        });
        // Sent back to user
        return res.json({success: true, isLogin: true , accessToken, msg: "Đăng nhập thành công"})
    },

    // Check Verify OTP
    async checkVerifyOTP (req, res) {
        try {
            // Get the lasted otp
            const result = await verifyOtp.find({
                email: req.body.email
            }).sort({createdAt: -1}).limit(1)
            // Check if not exies
            if (!result[0]) return res.send({success: false, msg: "Không tìm thấy mã OTP"})
            
            // Check expireAt
            if (result[0].expireAt < Date.now()) {
                await verifyOtp.deleteMany({email: req.body.email})
                res.send({success: false, msg: "Mã OTP đã hết hạn"})
            } else {
                const otpValid = await bcrypt.compare(req.body.otp , result[0].otp)
                if (!otpValid) return res.send({success: false, msg: "Mã OTP không đúng"})
                
                // Change status of user
                await User.findOneAndUpdate({
                    email: req.body.email
                },{ 
                    isVerifi: true
                })
                await verifyOtp.deleteMany({email: req.body.email})
                // Send true okay            
                return res.json({success: true, msg: "Xác thực thành công"})
            }
        } catch (error) {
            console.log(error);
        }
    },
    
    // Post User send email vertify
    async sendVerify (req, res) {
        try {
            const otp = Math.floor(1000 + Math.random() * 9000);
            const hashOtp = await bcrypt.hash(`${otp}`, 10)

            const mailInfo = {
                from: `ADMIN <${GMAIL_EMAIL}>`, 
                to: req.body.email, 
                subject: "Thư xác thực email",
                text: `<h1>${otp}<h1>`, 
                html: `<p>Mã xác thực của bạn là <h1>${otp}<h1> <br> Lưu ý mã chỉ có hiệu lực 1 tiếng </p>`, 
            };
            
            await verifyOtp.create({
                email: req.body.email, 
                otp: hashOtp,
                expireAt: Date.now() + 3600000
            })
            await transporter.sendMail(mailInfo)
            return res.json({success : true, msg: 'Gửi mail thành công'})
            
        } catch (error) {
            console.log(error);
            return res.json({success : false, msg: "Gửi mail thất bại"})
        }
    },

    // Post request forgot password
    async forgotPassword (req, res) {
        try {
            const user = await User.findOne({ email: req.body.email })
            if (!user) return res.json({success: false, msg: "Email không tồn tại"})
            const token = jwt.sign({_id: user._id}, RESET_PASSWORD, {
                expiresIn : "10m"
            })
            const mailInfo = {
                from: `ADMIN <${GMAIL_EMAIL}>`, 
                to: req.body.email, 
                subject: "Thư xác nhân đổi mật khẩu", 
                html: `<p>Nhấn vào đường dẫn này để đổi mật khẩu <a href="${CLIENT_SITE}/change-password/${token}">Tới trang đổi mật khẩu</a> 
                    <br> Lưu ý mã chỉ có hiệu lực 10 phút
                </p>`, 
            };
            await transporter.sendMail(mailInfo)
            return res.json({success : true, msg: 'Gửi thành công hãy kiểm tra mail của bạn'})
        } catch (error) {
            console.log(error);
            return res.json({success : false, msg: "Gửi mail thất bại"})
        }
    },

    // Post Check reset token
    async checkValidResetPass (req, res) {
        try {
            const token = req.body.token 
            jwt.verify(token, RESET_PASSWORD, (err, data) => {
                if (err) {
                    return res.json({success : false, msg: "Token đã quá hạn"})
                } else {
                    return res.json({success: true ,_id: data._id, msg: "Token còn hạn"})
                }
            })
        } catch (error) {
            console.log(error);
            return res.json({success : false, msg: "Đã có lỗi xảy ra"})
        }
    },
    // Post reset password
    async resetPassword (req, res) {
        try {
            const hashPass = await bcrypt.hash(`${req.body.password}`, 10)
            // const token = req.body.token 
            const userUpdate = await User.findByIdAndUpdate(req.body.userId, {
                password: hashPass
            }, {new: true}) 

            if (!userUpdate) return res.json({success : false, msg: "Đã có lỗi xảy ra"})
            return res.json({success : true, msg: "Đã cập nhật mật khẩu"})
        } catch (error) {
            console.log(error);
            return res.json({success : false, msg: "Đã có lỗi xảy ra"})
        }
    },

    // Post reset with old password
    async resetWithOldPassword (req, res) {
        try {
            const user = await User.findOne({_id: req.body.userId}) 
            // Check old password
            const passValid = await bcrypt.compare(req.body.oldPassword , user.password)
            if (!passValid) return res.send({success: false, msg: "Sai mật khẩu"})
            
            const hashPass = await bcrypt.hash(`${req.body.password}`, 10)
            // const token = req.body.token 
            const userUpdate = await User.findByIdAndUpdate(req.body.userId, {
                password: hashPass
            }, {new: true}) 

            if (!userUpdate) return res.json({success : false, msg: "Đã có lỗi xảy ra"})
            return res.json({success : true, msg: "Đã cập nhật mật khẩu"})
        } catch (error) {
            console.log(error);
            return res.json({success : false, msg: "Đã có lỗi xảy ra"})
        }
    },


}

module.exports = AuthController