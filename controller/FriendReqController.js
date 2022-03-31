const FriendReq = require("../models/friendReq");
const User = require("../models/user");

const FriendReqController = {

    async sendFriendReq(req, res) {    
        const newFriendReq = new FriendReq({
            sender: req.body.sender,
            reciver: req.body.reciver
        })

        try {
            const saved = await newFriendReq.save();
            return res.json(saved)
        } catch (error) {
            return res.json(error)
        }
    },

    async getFriendReq(req, res) {    
        try {
            const result = await FriendReq.find({
                sender: req.params.sender
            }).populate('reciver')
            return res.json(result)
        } catch (error) {
            return res.json(error)
        }
    },

    async acceptFriendReq(req, res) {    
        try {
            const friendReq = await FriendReq.findOne({
                id: req.body.id
            })
            /// add sender -> currUser
            const update = User.findOneAndUpdate({
                _id: req.body.currentUserId
            },{
                $push: {friend: friendReq.sender}
            })

            const updateFriend = User.findOneAndUpdate({
                _id: friendReq.sender
            },{
                $push: {friend: req.body.currentUserId}
            })
            const remove = FriendReq.findOneAndRemove({ id : req.body.id})

            Promise.all([update,updateFriend, remove])
            .then(() => {
                return res.json({success: true})
            })
        } catch (error) {
            return res.json(error)
        }
    },

    async getAcceptFriendReq(req, res) {    
        try {
            const result = await FriendReq.find({
                reciver: req.params.reciver
            }).populate('sender')
            return res.json(result)
        } catch (error) {
            return res.json(error)
        }
    },

    async unSendFriendReq(req, res) {    
        const reqId = req.body.reqId
        try {
            await FriendReq.findOneAndRemove({ _id : reqId})
            return res.json({msg : "Unsend success"})
        } catch (error) {
            return res.json(error)
        }
    },

}

module.exports = FriendReqController