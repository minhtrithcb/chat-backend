const {Schema, model} = require("mongoose");

const chatsSchema = new Schema({
    roomId: { 
        type: String, 
        index: true
    },
    sender: {
        type: String, 
        required: true,
    },
    reCall : {
        type: Boolean,
        default: false
    },
    replyMsg: Object,
    reacts: [
        {
            user: [{
                type: Object
            }],
            type: {
                type: String
            }
        }
    ],
    isEdit: {
        type: Boolean,
        default: false
    },
    text: {
        type: String, 
        required: true,
    },
    type: {
        type: String, 
        default: "Text"
    }
},{
    versionKey: false,
    timestamps: true
});

module.exports = model("chats",chatsSchema)