const Chat = require("../models/chat");
const Conversation = require("../models/conversation")

const ConversationController = {
   
    async post (req, res ) {
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

    async get (req, res) {
        try {
            const conversation = await Conversation.find({
                members : { $in : [req.params.userId]}
            })
            return res.json(conversation)
        } catch (error) {
            return res.json(error)
        }
    },

    async lastMsg (req, res) {
        const roomId = req.params.roomId
        // console.log(roomId);
        try {
            const chat = await Chat.findOne({roomId}).sort({createdAt: -1})
            return res.json(chat)
        } catch (error) {
            return res.json(error)
        }
    } 

}

module.exports = ConversationController