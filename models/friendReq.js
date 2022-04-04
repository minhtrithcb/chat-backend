const {Schema, model} = require("mongoose");

const friendReqSchema = new Schema({
    sender: {
        type: Object
    }, 
    reciver : {
        type: Object
    }
},{
    versionKey: false,
    timestamps: true
});

module.exports = model("friendReqs",friendReqSchema)