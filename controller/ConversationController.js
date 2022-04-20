const Chat = require("../models/chat");
const Conversation = require("../models/conversation")

const ConversationController = {
     // Get all Conversation by userId    
     async get (req, res) {
        try {
            if (req.body.type === "All") {
                const conversation = await Conversation.find({
                    members : { $in : [req.body.userId]},
                }).sort({updatedAt : -1})
                .populate('members')
                return res.json(conversation)
            } else {
                const conversation = await Conversation.find({
                    members : { $in : [req.body.userId]},
                    type: req.body.type  
                }).sort({updatedAt : -1})
                .populate('members')
                return res.json(conversation)
            }
        } catch (error) {
            return res.json(error)
        }
    },
     // Get One Conversation by userId    
    async getOne (req, res) {
        try {
            const conversation = await Conversation.findOne({
                members : { $all : [req.body.currentUserId, req.body.friendId]},
                type: "Friend"
            })
            .populate('members')
            return res.json(conversation)
        } catch (error) {
            return res.json(error)
        }
    },


    // Post delete a Conversation => then delete all chat of this conversation
    async delete (req, res) {
        const currentUserId = req.body.currentUserId
        const friendId = req.body.friendId

        try {
            let conver = await Conversation.findOneAndDelete({
                members : { $all : [friendId, currentUserId]}
            })
            await Chat.deleteMany({roomId: conver._id})
            return res.json({msg: "Delete success"})
        } catch (error) {
            return res.json(error)
        }
    },

    // Post create new Conversation 
    async postFriend (req, res) {
        const newConversation = new Conversation({
            members: [req.body.senderId, req.body.receiverId],
            owner: req.body.senderId,
            type: "Friend"
        })

        try {
            const saved = await newConversation.save();
            return res.json(saved)
        } catch (error) {
            return res.json(error)
        }
    },

    async postGroup (req, res) {
        const newConversation = new Conversation({
            members: req.body.members,
            owner: req.body.owner,
            name: req.body.nameGroup,
            type: "Group"
        })

        try {
            const saved = await newConversation.save();
            return res.json({msg: "Create success", success: true ,saved})
        } catch (error) {
            return res.json(error)
        }
    },
    // Get last message by roomId
    async lastMsg (req, res) {
        try {
            const chat = await Chat.findOne({
                roomId: req.params.roomId
            })
            .sort({'_id': -1}).limit(1)
            return res.json(chat)
        } catch (error) {
            return res.json(error)
        }
    } ,
    // Post user unRead
    async postUnReadMsg (req,res) {
        try {
            // Find in readBy 
            let found = await Conversation.findOne({
                _id: req.body.roomId,
                'readBy._id': {$all: req.body.recivers.map(i => i._id)}
            })

            // Not Found push every users in readBy with defalt {0 (currentUser) , 1 (order) }
            if (found === null) {
                let result = await Conversation.findOneAndUpdate({
                    _id: req.body.roomId,
                },{
                    readBy : req.body.recivers
                },{new: true})
                
                return res.json({msg: "first Push", result})
            // increase all field count by one except user who send this
            } else {
                let result = await Conversation.findOneAndUpdate({
                    _id: req.body.roomId,
                },{
                    $inc:  {
                        'readBy.$[x].count': 1,
                    }
                },
                {arrayFilters: [{
                    'x._id': { $ne : req.body.senderId}
                }], new: true})

                return res.json({msg: "found", result})
                
            }
        } catch (error) {
            return res.json(error)
        }
   },
    // Post user Read message
    async postReadMsg (req,res) {
        try {
            await Conversation.findOneAndUpdate({
                _id: req.body.roomId,
                'readBy._id': req.body.currentUserId
            },{
                $set:  {
                    'readBy.$._id': req.body.currentUserId,
                    'readBy.$.count': 0,
                }
            })

            return res.json({msg: "Readed "})
        } catch (error) {
            return res.json(error)
        }
   },
   

}

module.exports = ConversationController