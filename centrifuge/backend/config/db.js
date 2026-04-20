 const mongoose = require('mongoose');
 const logger = require('../logger.js');

const connectDb = async () =>{
    try{
        logger.info('DB URI:', process.env.MONGODB_URI);
        console.log('DB URI:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        
        logger.info('Connected to MongoDB');
        console.log('Connected to MongoDB');

    }catch(err){
        logger.error('Error connecting to database')
        console.log('Error connecting to database');
        process.exit(1);
    }

};
module.exports = connectDb;