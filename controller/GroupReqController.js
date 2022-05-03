const Conversation = require("../models/conversation");
const GroupReq = require("../models/groupReq");

const GroupReqController = {

    // post create Group request
    async createGroupReqs(req,res) {
        const newFriendReq = new GroupReq({
            sender: req.body.sender,
            reciver: req.body.reciver,
            room: req.body.room
        })
        try {
            const saved = await newFriendReq.save();
            return res.json(saved)
        } catch (error) {
            return res.json(error)
        }
    },

    // get Group request by sender
    async getGroupReq(req, res) {    
        try {
            const result = await GroupReq.find({
                'sender._id' : {$in :[req.params.sender]}
            })
            return res.json(result)
        } catch (error) {
            return res.json(error)
        }
    },

    // get accept Group request by reciver
    async getAcceptGroupReq(req, res) {    
        try {
            const result = await GroupReq.find({
                'reciver._id' : {$in :[req.params.reciver]}
            })
            return res.json(result)
        } catch (error) {
            return res.json(error)
        }
    },

    // post reciver accept Group request => update friendList sender & reciver then delete Group Request
    async acceptGroupReq(req, res) {    
        try {
            await Conversation.findOneAndUpdate({
                _id: req.body.roomId
            }, {
                $push : {
                    members: req.body.senderId 
                }
            })

            await GroupReq.findOneAndRemove({ _id : req.body.reqId})

            return res.json({success: true})
        } catch (error) {
            return res.json(error)
        }
    },

    // post unsend Group request => delete Group request
    async unSendGroupReq(req, res) {    
        const reqId = req.body.reqId
        try {
            await GroupReq.findOneAndRemove({ _id : reqId})
            return res.json({msg : "Unsend success"})
        } catch (error) {
            return res.json(error)
        }
    },

}

module.exports = GroupReqController