const Chat = require("../models/chat")

const ChatController = {
   
    async post (req,res) {
        const newChat = new Chat({
            roomId: req.body.roomId,
            sender: req.body.sender,
            text: req.body.text
        })

        try {
            const saved = await newChat.save();
            return res.json(saved)
        } catch (error) {
            return res.json(error)
        }
   },

   async get (req,res) {
    try {
        const chat = await Chat.find({
            roomId : req.params.roomId
        })
        return res.json(chat)
    } catch (error) {
        return res.json(error)
    }
   }

}

module.exports = ChatController