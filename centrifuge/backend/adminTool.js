// adminTool.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const logger = require('./logger.js');

const args = require("minimist")(process.argv.slice(2));

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const email = args.email;
    const password = args.password;

    if (!email || !password) {
      logger.error("Usage: node adminTool.js --email <EMAIL> --password <PASSWORD>");
      console.error("Usage: node adminTool.js --email <EMAIL> --password <PASSWORD>");
      process.exit(1);
    }

    let admin = await User.findOne({ userType: "ADMIN" });
    if (admin) {
      logger.info("Updating existing admin...")
      console.log("Updating existing admin...");
      admin.email = email;
      admin.password = await bcrypt.hash(password, 10);
      await admin.save();
    } else {
      logger.info("Creating new admin...");
      console.log("Creating new admin...");
      await User.create({
        firstName: "Super",
        lastName: "Admin",
        email,
        password: await bcrypt.hash(password, 10),
        accountStatus: "ACTIVE",
        userType: "ADMIN",
      });
    }
    logger.info("Admin setup complete.");
    console.log("Admin setup complete.");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

run();
