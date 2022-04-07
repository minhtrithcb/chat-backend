const Chat = require("../models/chat")

const ChatController = {
    
    // Post create new chat 
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
    // Get all chat by roomId (ConvertationId) Then sort des
    async get (req,res) {
        try {
            const chat = await Chat.find({
                roomId : req.params.roomId
            }).sort({createdAt: -1})
            
            return res.json(chat)
        } catch (error) {
            return res.json(error)
        }
    }
}

module.exports = ChatController