const jwt = require("jsonwebtoken");
const jose = require("jose");

// exports.generateToken = (user) => {
//   return jwt.sign(
//     {
//       //   user: user._id,
//       userId: user.userId,
//       email: user.email,
//       userType: user.userType
//     },
//     process.env.JWT_SECRET,
//     { expiresIn: '5h' }
//   );
// };

exports.generateToken = async (user) => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const alg = "HS256";

  const token = await new jose.SignJWT({
    sub: user.email,
    info: { email: user.email, userType: user.userType },
  })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("5h")
    .sign(secret);
  console.log("TOKEN: ", token);

  return token;
};

exports.generateFeedbackToken = (email, eventId) => {
  return jwt.sign({ email, eventId }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });
};
