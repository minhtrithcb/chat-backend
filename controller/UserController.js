const bcrypt = require('bcrypt');
const User = require("../models/user")
const {A_TOKEN_SECRET} = require("../config/env.config")
const jwt = require("jsonwebtoken")

const UserController = {
   
    async getUsers (req, res) {
       User.find()
        .then((data) => {
            return res.json({
                success: true,
                data
            })
        }).catch(err => {
            return res.json({
                success: false,
                msg: err
            })
        })
    },

}

module.exports = UserController