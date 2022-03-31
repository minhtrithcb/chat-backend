const FriendReq = require("../models/friendReq")
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

    async searchUser(req, res) {    
        try {
            const currentUserId = req.body.currentUser // id

            const result = User.find({
                _id: {$ne: currentUserId},
                $or: [{
                    "fullname":  { '$regex' : req.body.search , '$options' : 'i'},
                }, {
                    "email":  { '$regex' : req.body.search , '$options' : 'i'}
                }]
            })

            const currentUser = User.findOne({
                _id: currentUserId,
            })

            const friendReq = FriendReq.find({sender: currentUserId})

            Promise.all([result, currentUser, friendReq])
            .then(data => {
                return res.json(data)
            })
            
        } catch (err) {
            return res.json({
                success: false,
                msg: err
            })
        }
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