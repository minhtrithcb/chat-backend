const {Schema, model} = require("mongoose");

const GroupReqSchema = new Schema({
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

module.exports = model("groupReqs",GroupReqSchema)