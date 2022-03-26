const User = require("../models/user")

const UserController = {
   
    async getUser (req, res) {
       User.findOne({_id : req.params.userId})
        .then((data) => {
            
            return res.json(data)

        }).catch(err => {
            return res.json({
                success: false,
                msg: err
            })
        })
    },

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