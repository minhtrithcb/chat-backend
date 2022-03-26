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
    }

}

module.exports = ConversationController