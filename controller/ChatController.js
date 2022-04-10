const Chat = require("../models/chat");
const Conversation = require("../models/conversation");

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
            await Conversation.findOneAndUpdate({
                _id: req.body.roomId
            },{
                lastMsg: saved
            })
            return res.json(saved)
        } catch (error) {
            return res.json(error)
        }
   },
    // Patch to create reaction 
    async patchReacts (req,res) {
        try {
            // Find and pull if user already reaction same type ex:{uid: 1, type: "like"} same {uid: 1, type: "like"}
            const found = await Chat.findOne({
                _id: req.body.chatId,
                $and: [
                    {
                        'reacts.user.id':  req.body.user.id
                    },
                    {
                        'reacts.type':  req.body.type
                    },
                ]
            })

            // return res.json({found})
            // },{
            //     $pull: {
            //         reacts: {
            //             user :req.body.user,
            //             type :req.body.type
            //         }
            //     }
            // },{new: true})

            // If not found mean user post anoder type of reactin ex: {uid: 1, type: "haha"}
            if (found === null) {
               let found = await Chat.findOneAndUpdate({
                    _id: req.body.chatId,
                    },{
                        $push: {
                            reacts: {
                                user :req.body.user,
                                type :req.body.type
                            }
                        },
                },{new: true})

                return res.json({msg: "patch success push", found})
            } else {
                const found = await Chat.findOneAndUpdate({
                    _id: req.body.chatId,
                    $and: [
                        {
                            'reacts.user.id':  req.body.user.id
                        },
                        {
                            'reacts.type':  req.body.type
                        },
                    ]
                },{
                    $pull: {
                        reacts: {
                            // user :req.body.user,
                            type :req.body.type
                        }
                    }
                },{new: true})

                return res.json({msg: "patch success pull", found})
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
            }).sort({createdAt: -1})
            
            return res.json(chat)
        } catch (error) {
            return res.json(error)
        }
    }
}

module.exports = ChatController