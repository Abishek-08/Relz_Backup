require("dotenv").config();
const ldap = require("ldapjs");
const logger = require("../logger");

const searchEmployees = async (keyword) => {
  return new Promise((resolve, reject) => {
    const client = ldap.createClient({
      url: `ldaps://${process.env.RELEVANTZ_LDAP_LOGIN_IP}:${process.env.RELEVANTZ_LDAP_LOGIN_PORT}`,
      tlsOptions: { rejectUnauthorized: false },
    });

    client.on("error", (err) => {
      logger.error("[LDAP] Client error:", err.message);
      console.error("[LDAP] Client error:", err.message);
      return reject("LDAP connection failed");
    });

    const adminUPN = `${process.env.RELEVANTZ_LDAP_LOGIN_USERNAME}${process.env.RELEVANTZ_LDAP_LOGIN_ACSUFFIX}`;

    // 1️⃣ Bind as Admin
    client.bind(adminUPN, process.env.RELEVANTZ_LDAP_LOGIN_PASSWORD, (err) => {
      if (err) {
        logger.error("[LDAP] Admin bind failed:", err.message);
        console.error("[LDAP] Admin bind failed:", err.message);
        return reject("Admin LDAP bind failed: Invalid credentials");
      }

      // 2️⃣ LDAP filter to search CN or Mail containing the keyword
      const searchOptions = {
        filter: `(|(cn=*${keyword}*)(mail=*${keyword}*))`,
        scope: "sub",
        attributes: ["cn", "mail"],
      };

      // 3️⃣ Search
      client.search(
        process.env.RELEVANTZ_LDAP_LOGIN_BASEDN,
        searchOptions,
        (err, res) => {
          if (err) {
            client.unbind();
            return reject("LDAP search failed: " + err.message);
          }

          const results = [];

          res.on("searchEntry", (entry) => {
            try {
              const attrs = entry.attributes ?? [];
              let empData = {};
              for (const attr of attrs) {
                empData[attr.type] = attr.values?.[0] || null;
              }

              results.push({
                fullName: empData.cn || "",
                email: empData.mail || "",
              });
            } catch (e) {
              logger.error("Error parsing entry attributes:", e.message);
              console.error("⚠️ Error parsing entry attributes:", e.message);
            }
          });

          res.on("error", (err) => {
            client.unbind();
            return reject("LDAP stream error: " + err.message);
          });

          res.on("end", () => {
            client.unbind();
            return resolve(results);
          });
        },
      );
    });
  });
};

module.exports = searchEmployees;
