const {Schema, model} = require("mongoose");

const conversationSchema = new Schema({
    members: [{ 
        type: Schema.Types.ObjectId, ref: 'users' 
    }],
    membersLeave: [{ 
        type: Schema.Types.ObjectId, ref: 'users' 
    }],
    owner: { 
        type: Schema.Types.ObjectId, ref: 'users' 
    },
    private: {
        type: Boolean,
        default: false
    },
    readBy : [{
        type: Object
    }],
    lastMsg: Object,
    name: String,
    type: String,
    inviteCode: String,
    rule: String,
    des: String,
    membersBanned: [{
        _id: String,
        reason: String,
        time: Date
    }]
},{
    versionKey: false,
    timestamps: true
});

module.exports = model("conversations",conversationSchema)