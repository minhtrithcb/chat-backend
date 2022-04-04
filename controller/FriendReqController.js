const FriendReq = require("../models/friendReq");
const User = require("../models/user");

const FriendReqController = {

    async createFriendReqs(req,res) {
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
                'sender._id' : {$in :[req.params.sender]}
            })
            return res.json(result)
        } catch (error) {
            return res.json(error)
        }
    },

    async getAcceptFriendReq(req, res) {    
        try {
            const result = await FriendReq.find({
                'reciver._id' : {$in :[req.params.reciver]}
            })
            return res.json(result)
        } catch (error) {
            return res.json(error)
        }
    },

    async acceptFriendReq(req, res) {    
        try {
            /// add sender -> currUser
            const updateCurrUser = User.findOneAndUpdate({
                _id: req.body.currentUserId
            },{
                $push: {friend: req.body.sender}
            })

            const updateFriendUser = User.findOneAndUpdate({
                _id: req.body.sender
            },{
                $push: {friend: req.body.currentUserId}
            })

            const deleteFr = FriendReq.findOneAndRemove({ _id : req.body.id})

            Promise.all([updateCurrUser, updateFriendUser, deleteFr])
            .then(() => {
                return res.json({success: true})
            })
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