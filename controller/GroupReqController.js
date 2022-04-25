const FriendReq = require("../models/friendReq");
const User = require("../models/user");

const GroupReqController = {

    // post create friend request
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

    // get friend request by sender
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

    // get accept friend request by reciver
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

    // post reciver accept friend request => update friendList sender & reciver then delete Friend Request
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

    // post unsend friend request => delete Friend request
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

module.exports = GroupReqController