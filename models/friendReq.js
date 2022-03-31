const {Schema, model} = require("mongoose");

const friendReqSchema = new Schema({
    sender: { 
        type: Schema.Types.ObjectId, ref: 'users' 
    }, 
    reciver : {
        type: Schema.Types.ObjectId, ref: 'users' 
    },
    status: {
        type : Boolean,
        default: false
    }
},{
    versionKey: false,
    timestamps: true
});

module.exports = model("friendReqs",friendReqSchema)