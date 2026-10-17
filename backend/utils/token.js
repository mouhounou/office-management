const jwt = require("jsonwebtoken");
const { jwtSecret, jwtExpiresIn } = require("../config/env");

function signToken(user) {
  return jwt.sign({ sub: String(user._id), role: user.role }, jwtSecret, {
    expiresIn: jwtExpiresIn,
  });
}

function verifyToken(token) {
  return jwt.verify(token, jwtSecret);
}

// Jetons des comptes du site public : audience distincte, refusée par l'admin.
const MEMBER_AUDIENCE = "member";

function signMemberToken(member) {
  return jwt.sign({ sub: String(member._id) }, jwtSecret, {
    expiresIn: jwtExpiresIn,
    audience: MEMBER_AUDIENCE,
  });
}

function verifyMemberToken(token) {
  return jwt.verify(token, jwtSecret, { audience: MEMBER_AUDIENCE });
}

module.exports = { signToken, verifyToken, signMemberToken, verifyMemberToken, MEMBER_AUDIENCE };
