const mongoose = require('mongoose');
const getNextSequence = require('../utils/getNextSequence');

const userSchema = new mongoose.Schema({
    userId:{type: Number, unique:true},
    firstName:{type: String, require:true},
    lastName:{type: String},
    email:{type: String, require:true, unique:true},
    password: {type:String, require: true},
    accountStatus:{type: String, require:true, default: "ACTIVE"},
    userType:{
        type: String,
        enum: ["ADMIN", "EVENTMANAGER"],
        require: true
    }

},{ timestamps: true });

userSchema.pre('save', async function(next){
    if(!this.userId){
        this.userId = await getNextSequence('userId');
    }
    next();
});

module.exports = mongoose.model('User', userSchema);