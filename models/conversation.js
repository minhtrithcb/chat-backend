const {Schema, model} = require("mongoose");

const conversationSchema = new Schema({
    members: [{ 
        type: Schema.Types.ObjectId, ref: 'users' 
    }],
    name: {
        type: String, 
    },
    owner: { 
        type: Schema.Types.ObjectId, ref: 'users' 
    },
    lastMsg: Object,
    private: {
        type: Boolean,
        default: true
    },
    type: {
        type: String,
    }
},{
    versionKey: false,
    timestamps: true
});

module.exports = model("conversations",conversationSchema)