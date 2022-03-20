const {Schema, model} = require("mongoose");

const UsersSchema = new Schema({
    fullname :{
        type: String, 
        trim: true,
        required: true,
        minlength: 6, 
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6, 
        select: false
    },
    email : {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    status : {
        type: Boolean,
        default: true
    },
    isVerifi: {
        type: Boolean,
        default: false
    },
    friend: [{ 
        type: Schema.ObjectId, ref: 'users' 
    }]
},{
    versionKey: false,
    timestamps: true
});

module.exports = model("users",UsersSchema)