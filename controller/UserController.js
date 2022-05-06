const Conversation = require("../models/conversation")
const FriendReq = require("../models/friendReq")
const GroupReq = require("../models/groupReq")
const User = require("../models/user")

const UserController = {
   
    // Find One user
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

    // Find all user by fullname or email
    async searchUser(req, res) {    
        try {
            const currentUserId = req.body.currentUser // id

            const userSearch = User.find({
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

            const friendReq = FriendReq.find({'sender._id': currentUserId})

            const groups = Conversation.find({
                name : { '$regex' : req.body.search , '$options' : 'i'},
            })

            const groupReq = GroupReq.find({
                'sender._id' : currentUserId
            })

            const converGroup =  Conversation.find({
                members : { $in : [currentUserId]},
                type: "Group"
            })

            Promise.all([userSearch, currentUser, friendReq, groups, groupReq, converGroup])
            .then((data) => {
                return res.json({
                    users: data[0],
                    userFriends: data[1].friend,
                    friendReqs: data[2],
                    groups: data[3],
                    groupReq: data[4],
                    userGroup: data[5]
                })
            })
            
        } catch (err) {
            return res.json({
                success: false,
                msg: err
            })
        }
    },
    
    // Get all users
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

    // Currnet User unfriend => update friendlist bot friend and currnet user 
    async unFriend (req, res) {
        const friendId = req.body.friendId
        const currentUserId = req.body.currentUserId

        try {
            const user = User.findOneAndUpdate({
                _id : currentUserId
            },{
                $pull: {
                    friend: friendId
                },
            })

            const friend = User.findOneAndUpdate({
                _id : friendId
            },{
                $pull: {
                    friend: currentUserId
                },
            })

            Promise.all([user, friend])
                .then(() => {
                    return res.json({msg: 'unfriend success'})
                })
         } catch (error) {
             return res.json({
                 success: false,
                 msg: error
             })
        }
    },

    // Get FriendList by currnent user
    async getFriendUser (req, res) {
        try {
           const user = await User.findOne({_id : req.params.id}).populate('friend')
           return res.json(user.friend)
        } catch (error) {
            return res.json({
                success: false,
                msg: error
            })
       }
    },
}

module.exports = UserController