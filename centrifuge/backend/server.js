const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const minimist = require('minimist');
const app = require('./app')
const setupSocket = require('./socket')
const logger = require('./logger.js')

// Parse CLI args
const args = minimist(process.argv.slice(2));
const host = args.host || 'localhost';
const port = args.port || 5005
const keyPath = args.key;
const certPath = args.cert;


// if (!keyPath || !certPath) {
  //   logger.error("❌ Please provide --key and --cert paths");
//   console.error("❌ Please provide --key and --cert paths");
//   process.exit(1);
// }

// Validate cert files
// if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
// logger.error(`❌ SSL key or cert file not found.\nKey: ${keyPath}\nCert: ${certPath}`);
//   console.error(`❌ SSL key or cert file not found.\nKey: ${keyPath}\nCert: ${certPath}`);
//   process.exit(1);
// }

// Load SSL credentials
// const sslOptions = {
//   key: fs.readFileSync(path.resolve(keyPath)),
//   cert: fs.readFileSync(path.resolve(certPath)),
// };

// socket local
const server = http.createServer(app);
//socker vm
//  const httpsServer = https.createServer(sslOptions, app);

  setupSocket(server);
// setupSocket(httpsServer);


// Start HTTPS server vm
// httpsServer.listen(port, host, () => {
// logger.info(`HTTPS server running at https://${host}:${port}`);
//   console.log(`HTTPS server running at https://${host}:${port}`);
// });

//local
server.listen(port, host, () => {
  logger.info(`HTTP server running at http://${host}:${port}`);
  console.log(`HTTP server running at http://${host}:${port}`);
});


