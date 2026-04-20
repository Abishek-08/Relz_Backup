require('dotenv').config();
const ldap = require('ldapjs');
const User = require('../models/User');
const eventManagerDao = require('../dao/EventManagerDao');
// const Login = require('../models/Login');
const bcrypt = require('bcrypt');
const logger = require('../logger');

const ldapAuthenticate = async (email, password) => {
  return new Promise((resolve, reject) => {
    const client = ldap.createClient({
      url: `ldaps://${process.env.RELEVANTZ_LDAP_LOGIN_IP}:${process.env.RELEVANTZ_LDAP_LOGIN_PORT}`,
      tlsOptions: { rejectUnauthorized: false }
    });

    client.on('error', (err) => {
      logger.error('[LDAP] Client error:', err.message);
      console.error('[LDAP] Client error:', err.message);
      return reject(new Error('LDAP connection failed'));
    });

    const adminUPN = `${process.env.RELEVANTZ_LDAP_LOGIN_USERNAME}${process.env.RELEVANTZ_LDAP_LOGIN_ACSUFFIX}`;

    client.bind(adminUPN, process.env.RELEVANTZ_LDAP_LOGIN_PASSWORD, (err) => {
      if (err) {
        logger.error('[LDAP] Admin bind failed:', err.message);
        console.error('[LDAP] Admin bind failed:', err.message);
        return reject('Admin LDAP bind failed: Invalid credentials');
      }

      const searchOptions = {
        filter: `(|(mail=${email})(userPrincipalName=${email})(sAMAccountName=${email}))`,
        scope: 'sub',
        attributes: ['cn', 'sn', 'mail', 'userPrincipalName']
      };

      client.search(process.env.RELEVANTZ_LDAP_LOGIN_BASEDN, searchOptions, (err, res) => {
        if (err) {
          client.unbind();
          return reject('LDAP search failed: ' + err.message);
        }

        let userEntry = null;

        res.on('searchEntry', (entry) => {
          //console.log(' Entry DN:', entry.dn?.toString());

          let parsed = {};
          try {
            const attrs = entry.attributes ?? entry.pojo?.attributes ?? [];
            for (const attr of attrs) {
              parsed[attr.type] = attr.values?.[0] || null;
            }
            //console.log(' Parsed LDAP Attributes:', parsed);

            userEntry = {
              dn: entry.dn.toString(),
              object: parsed
            };
          } catch (e) {
            logger.error('Error parsing entry attributes:', e.message);
            console.error('⚠️ Error parsing entry attributes:', e.message);
          }
        });

        res.on('error', (err) => {
          client.unbind();
          return reject('LDAP stream error: ' + err.message);
        });

        res.on('end', () => {
          if (!userEntry || !userEntry.dn || !userEntry.object?.mail) {
            client.unbind();
            return reject('User not found or missing required attributes (mail)');
          }

          const userDN = userEntry.dn;
          const userData = userEntry.object;

          client.bind(userDN, password, async (err) => {
            if (err) {
              client.unbind();
              logger.error('User bind failed:', err.message);
              console.error('❌ User bind failed:', err.message);
              return reject(new Error('Invalid LDAP credentials'));
            }

            //             try {
            //               let user = await User.findOne({ email: userData.mail });
            //               const userType = user.userType?.toLowerCase();
            //               const hashedPwd = await bcrypt.hash(password.toString(), 10);
            //               let eventManager = await eventManagerDao.checkEventManagerByEmail(userData.mail)
            //               if ((!user && eventManager) || (!user && userType === 'admin')) {
            //                 user = new User({
            // firstName: userData.cn || '',
            // lastName: userData.sn || '',
            //                   email: userData.mail,
            //                   mobileNumber: 'NA',
            //                   accountStatus: 'ACTIVE',
            //                   userType: 'EVENTMANAGER',
            //                   password: hashedPwd,
            //                 });
            // await user.save();
            //               }

            // //               let login = await Login.findOne({ email: userData.mail });
            // //               if (!login) {
            // //                 const hashedPwd = await bcrypt.hash(password.toString(), 10);
            // //                 login = new Login({
            // //                   email: userData.mail,
            // //                   password: hashedPwd,
            // //                   user: user._id,
            // //                   isPasswordChanged: true
            // //                 });
            // // await login.save();
            // //               }

            //               client.unbind();
            //               return resolve({ user });

            //             } 
              
            try {
              let user = await User.findOne({ email: userData.mail });
              const hashedPwd = await bcrypt.hash(password.toString(), 10);

              // Check if this email exists in EventManager table
              let eventManager = await eventManagerDao.checkEventManagerByEmail(userData.mail);
              logger.info(eventManager);
              console.log(eventManager);

              if (user) {
                // Admin logic: if user already exists in User table and is admin, allow login
                if (user.userType && user.userType.toLowerCase() === 'admin') {
                  return resolve({ user });
                }

                // Event Manager logic: if user already exists and is eventmanager, just allow login
                if (user.userType && user.userType.toLowerCase() === 'eventmanager' && eventManager) {
                  // Check if event manager is active
                  if (eventManager.accountStatus && eventManager.accountStatus.toUpperCase() !== 'ACTIVE') {
                    throw new Error('Account is inactive. Please contact the administrator.');
                  }
                  return resolve({ user });
                }
                

                // If user exists but doesn’t match conditions → unauthorized
                throw new Error('User not authorized');
              } else {
                // Event Manager creation logic: if not in User table but exists in EventManager table → create
                if (eventManager) {
                  user = new User({
                    firstName: userData.cn || '',
                    lastName: userData.sn || '',
                    email: userData.mail,
                    mobileNumber: 'NA',
                    accountStatus: 'ACTIVE',
                    userType: 'EVENTMANAGER',
                    password: hashedPwd,
                  });
                  await user.save();
                  return resolve({ user });
                } else {
                  throw new Error('User not authorized');
                }
              }
            } catch (dbErr) {
              client.unbind();
              return reject(new Error(dbErr.message));
            }

          });
        });
      });
    });
  });
};

module.exports = ldapAuthenticate;