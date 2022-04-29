const Chat = require("../models/chat");
const Conversation = require("../models/conversation");

const ChatController = {
    
    // Post create new chat 
    async post (req,res) {
        const newChat = new Chat({
            roomId: req.body.roomId,
            sender: req.body.sender,
            text: req.body.text,
            type: req.body.type
        })

        try {
            const saved = await newChat.save();
            await Conversation.findOneAndUpdate({
                _id: req.body.roomId
            },{
                lastMsg: saved,
            })
            return res.json(saved)
        } catch (error) {
            return res.json(error)
        }
   },

    async patch (req,res) {
        try {
            let result = await Chat.findOneAndUpdate({
                _id: req.body.chatId,
                sender: req.body.sender
            },{
                text: req.body.text,
                isEdit: true
            }, {new: true})

            let room = await Conversation.findOneAndUpdate({
                _id: req.body.roomId,
                'lastMsg._id': result._id
            }, {
                lastMsg: result
            })
            
            return res.json({result, room})
        } catch (error) {
            return res.json(error)
        }
   },
    async reply (req,res) {
        const newChat = new Chat({
            roomId: req.body.roomId,
            sender: req.body.sender,
            text: req.body.text,
            replyMsg: req.body.replyMsg
        })

        try {
            const saved = await newChat.save();
            return res.json(saved)
        } catch (error) {
            return res.json(error)
        }
   },
    async reCall (req,res) {
        try {
            let result = await Chat.findOneAndUpdate({
                _id: req.body.chatId,
                sender: req.body.sender
            },{
                reCall: true,
                // text: "Tin nhắn đã bị thu hồi"
            }, {new: true})

            let room = await Conversation.findOneAndUpdate({
                _id: req.body.roomId,
                'lastMsg._id': result._id
            }, {
                lastMsg: result
            })
            
            return res.json({result, room})
        } catch (error) {
            return res.json(error)
        }
   },
    // Patch to create reaction 
    async addReacts (req,res) {
        try {
            // Find The Chat have reaction ex: like, wow, ...
            let found = await Chat.findOne({
                _id: req.body.chatId,
                'reacts.type': req.body.type  
            })

            // If not Found the reaction
            if (found === null) {
                    // Create type of reaction then First push
                    let result = await Chat.findOneAndUpdate({
                        _id: req.body.chatId,
                    },{
                        $push: {
                            reacts: {
                                user :req.body.user,
                                type :req.body.type
                            }
                        },
                },{new: true})
                return res.json({msg: "patch success first push", result})
            // If Found the reaction 
            } else {
                    // Find that reaction & user into it
                  
                    const userReaction = await Chat.findOne({
                        _id: req.body.chatId,
                        'reacts':  {
                            $elemMatch: { 
                                type :req.body.type ,
                                'user.id':req.body.user.id ,
                            }
                        }
                    })

                    // pull user reaction if user liked already
                    if (userReaction !== null) {
                        const result = await Chat.findOneAndUpdate({
                                _id: req.body.chatId,
                                'reacts.type':  req.body.type,
                                // 'reacts.user.id':  req.body.user.id
                            },{
                                $pull: {
                                    'reacts.$.user' : { 
                                        id: req.body.user.id
                                    },
                                }
                            },{new: true})
                        return res.json({msg: "patch success pull", result})
                    // Push user reaction
                    } else {
                        let result = await Chat.findOneAndUpdate({
                            _id: req.body.chatId,
                            'reacts.type': req.body.type  
                            },{
                                $push: {
                                    'reacts.$.user' : req.body.user
                                },
                        },{new: true})
    
                        return res.json({msg: "patch success push into user", result})
                    }
            }
        } catch (error) {
            return res.json(error)
        }
   },
    // Get all chat by roomId (ConvertationId) Then sort des
    async get (req,res) {
        try {
            const chat = await Chat.find({
                roomId : req.params.roomId
            }).skip(req.params.skip).sort({createdAt: -1}).limit(20)
            return res.json(chat)
        } catch (error) {
            return res.json(error)
        }
    }
}

module.exports = ChatController