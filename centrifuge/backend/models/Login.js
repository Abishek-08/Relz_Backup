const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');
const getNextSequence = require('../utils/getNextSequence');

const loginSchema = new mongoose.Schema({
    loginId: {type: Number, unique: true},
    email: {type:String, require: true},
    password: {type:String, require: true},
    otp:{type: String, default:null},
    otpExpiresAt:{type:Date, default:null},
    attemptCount: {type:Number, require:true, default:0},
    isPasswordChanged: {type:Boolean, require:true, default:false},
    loginCount:{type:Number, default:0},
    user:{type: mongoose.Schema.Types.ObjectId, ref:"User", unique:true, autopopulate:true}
},{ timestamps: true });

loginSchema.plugin(autopopulate);

loginSchema.pre('save', async function(next)  {
    if(!this.loginId){
        this.loginId = await getNextSequence('loginId');
    }
    next();
});

module.exports = mongoose.model('Login', loginSchema);