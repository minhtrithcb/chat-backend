const {Schema, model} = require("mongoose");

const friendReqSchema = new Schema({
    sender: { 
        type: Schema.Types.ObjectId, ref: 'users' 
    }, 
    reciver : {
        type: Schema.Types.ObjectId, ref: 'users' 
    }
},{
    versionKey: false,
    timestamps: true
});

module.exports = model("friendReqs",friendReqSchema)