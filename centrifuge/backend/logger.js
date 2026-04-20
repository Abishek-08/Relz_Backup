const pino = require("pino");
const { multistream } = require("pino-multi-stream");
const fs = require("fs");
const path = require("path");

// ensure logs directory exists
const logDir = path.join(__dirname, "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// daily file name
const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
const logFile = path.join(logDir, `app-${date}.log`);
const fileStream = fs.createWriteStream(logFile, { flags: "a" });

// console stream (pretty)
const consoleStream = pino.transport({
  target: "pino-pretty",
  options: {
    colorize: true,
    translateTime: "SYS:standard",
    ignore: "pid,hostname"
  }
});

// combine both
const streams = [
  { stream: consoleStream }, // console
  { stream: fileStream }     // file
];

const logger = pino({ level: "info" }, multistream(streams));

module.exports = logger;
