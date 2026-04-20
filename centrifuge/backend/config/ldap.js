// const ldap = require('ldapjs');

// const client = ldap.createClient({
//   url: process.env.LDAP_URL
// });

// const authenticateLDAP = (email, password) => {
//   const dn = `mail=${email},${process.env.LDAP_BASE_DN}`; 

//   return new Promise((resolve, reject) => {
//     client.bind(dn, password, (err) => {
//       if (err) return reject(err);
//       resolve('LDAP authentication successful');
//     });
//   });
// };


const ldap = require('ldapjs');
const dotenv = require('dotenv');
const logger = require('../logger');

dotenv.config();
if (!process.env.LDAP_URL || !process.env.LDAP_BASE_DN) {
  throw new Error('LDAP_URL and LDAP_BASE_DN must be defined in your .env file');
}

const client = ldap.createClient({
  url: process.env.LDAP_URL
});

client.on('error', (err) => {
  logger.error('LDAP connection error:', err.message);
  console.error('LDAP connection error:', err.message);
});

const authenticateLDAP = (email, password) => {
  const dn = `mail=${email},${process.env.LDAP_BASE_DN}`; // Adjust DN format if needed

  return new Promise((resolve, reject) => {
    client.bind(dn, password, (err) => {
      if (err) {
        logger.error('LDAP bind failed:', err.message);
        console.error('LDAP bind failed:', err.message);
        return reject('LDAP authentication failed');
      }
      resolve('LDAP authentication successful');
    });
  });
};

module.exports = authenticateLDAP;


