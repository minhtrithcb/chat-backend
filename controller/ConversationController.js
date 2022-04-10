const Chat = require("../models/chat");
const Conversation = require("../models/conversation")

const ConversationController = {

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
    async post (req, res) {
        const newConversation = new Conversation({
            members: [req.body.senderId, req.body.receiverId],
            owner: req.body.senderId
        })

        try {
            const saved = await newConversation.save();
            return res.json(saved)
        } catch (error) {
            return res.json(error)
        }
    },
    
    // Get all Conversation by userId    
    async get (req, res) {
        try {
            const conversation = await Conversation.find({
                members : { $in : [req.params.userId]}
            })
            .populate('members')
            return res.json(conversation)
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
    } 

}

module.exports = ConversationController