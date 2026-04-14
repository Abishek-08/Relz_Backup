const jose = require("jose");

exports.generateToken = async () => {
  const secret = new TextEncoder().encode("secret");
  const alg = "HS256";

  const token = await new jose.SignJWT({ sub: "user_42" })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);
  console.log(token);

  return token;
};
