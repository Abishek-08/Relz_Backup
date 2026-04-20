const crypto = require('crypto');
const dotenv = require('dotenv');
 
dotenv.config();

const ENCRYPTION_KEY = Buffer.from(process.env.JWT_ENCRYPTION_KEY, 'base64'); 
const ALGORITHM = 'aes-256-cbc';

exports.encryptToken = (token) => {
    try {  
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

      let encrypted = cipher.update(token, 'utf-8', 'hex');
      encrypted += cipher.final('hex');
  
      const result = `${iv.toString('hex')}:${encrypted}`;  
      return result;
    } catch (err) {
      throw err;
    }
  };
  

exports.decryptToken = (encryptedString) => {
    const [ivHex, encrypted] = encryptedString.split(':');
    const iv = Buffer.from(ivHex, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
   
    let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
   
    return decrypted; 
  };
