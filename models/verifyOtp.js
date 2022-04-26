const {Schema, model} = require("mongoose");

const verifyOtpSchema = new Schema({
    email : String,
    otp: String,
    expireAt : Date
},{
    versionKey: false,
    timestamps: true
});

module.exports = model("verifyOtp", verifyOtpSchema)