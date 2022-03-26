const {Schema, model} = require("mongoose");

const chatsSchema = new Schema({
    roomId: { 
        type: String, 
    },
    sender: {
        type: String, 
        required: true,
    },
    text: {
        type: String, 
        required: true,
    },
},{
    versionKey: false,
    timestamps: true
});

module.exports = model("chats",chatsSchema)