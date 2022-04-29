const {Schema, model} = require("mongoose");

const conversationSchema = new Schema({
    members: [{ 
        type: Schema.Types.ObjectId, ref: 'users' 
    }],
    membersLeave: [{ 
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
    },
    readBy : [{
        type: Object
    }]
},{
    versionKey: false,
    timestamps: true
});

module.exports = model("conversations",conversationSchema)