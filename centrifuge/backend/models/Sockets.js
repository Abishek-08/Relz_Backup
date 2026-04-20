const mongoose = require("mongoose");
const getNextSequence = require('../utils/getNextSequence');
const autopopulate = require('mongoose-autopopulate');

const socketSchema = mongoose.Schema({
    socketId: { type: Number, unique: true },
    socket: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    email: {type: String, required: true}
}, { timestamps: true });

socketSchema.plugin(autopopulate);

socketSchema.pre('save', async function(next){
    if(!this.socketId){
        this.socketId = await getNextSequence('socketId');
    }
    next();
});

module.exports = mongoose.model('Sockets', socketSchema);