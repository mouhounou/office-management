const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { verifyToken } = require("../utils/token");

function extractToken(req) {
  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) return header.slice(7);
  if (req.cookies && req.cookies.om_token) return req.cookies.om_token;
  return null;
}

// Vérifie le JWT et charge l'utilisateur dans req.user.
const protect = asyncHandler(async (req, _res, next) => {
  const token = extractToken(req);
  if (!token) throw ApiError.unauthorized();

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw ApiError.unauthorized("Session expirée ou invalide");
  }

  const user = await User.findById(payload.sub);
  if (!user) throw ApiError.unauthorized("Compte introuvable");
  if (!user.active) throw ApiError.forbidden("Compte désactivé");
  if (user.isTokenStale(payload.iat)) throw ApiError.unauthorized("Session expirée, reconnectez-vous");

  req.user = user;
  next();
});

// À utiliser après `protect` : authorize("admin") ou authorize("admin", "editor").
function authorize(...roles) {
  return (req, _res, next) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!roles.includes(req.user.role)) return next(ApiError.forbidden());
    next();
  };
}

module.exports = { protect, authorize };
