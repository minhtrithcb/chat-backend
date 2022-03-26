const {Schema, model} = require("mongoose");

const conversationSchema = new Schema({
    members: { 
        type: Array
    },
    name: {
        type: String, 
    },
    owner: {
        type: String, 
        required: true,
    },
    private: {
        type: Boolean,
        default: true
    },
},{
    versionKey: false,
    timestamps: true
});

module.exports = model("conversations",conversationSchema)