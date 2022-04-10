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
    reacts: [
        {
            user: {
                type: Object
            },
            type: {
                type: String
            }
        }
    ],
    text: {
        type: String, 
        required: true,
    },
},{
    versionKey: false,
    timestamps: true
});

module.exports = model("chats",chatsSchema)