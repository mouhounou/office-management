const Member = require("../models/Member");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { verifyMemberToken } = require("../utils/token");

const MEMBER_COOKIE = "om_member";

function extractToken(req) {
  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) return header.slice(7);
  return req.cookies?.[MEMBER_COOKIE] ?? null;
}

/** Charge le compte client du jeton, ou renvoie null s'il est absent ou invalide. */
async function loadMember(req) {
  const token = extractToken(req);
  if (!token) return null;
  let payload;
  try {
    payload = verifyMemberToken(token);
  } catch {
    return null;
  }
  const member = await Member.findById(payload.sub);
  if (!member || !member.active || member.isTokenStale(payload.iat)) return null;
  return member;
}

// Espace client : compte connecté obligatoire.
const protectMember = asyncHandler(async (req, _res, next) => {
  const member = await loadMember(req);
  if (!member) throw ApiError.unauthorized("Connectez-vous pour accéder à votre espace");
  req.member = member;
  next();
});

// Dépôts du site : rattache la demande au compte s'il y en a un, sans l'exiger.
const optionalMember = asyncHandler(async (req, _res, next) => {
  req.member = await loadMember(req);
  next();
});

module.exports = { protectMember, optionalMember, MEMBER_COOKIE };
