// Express 5 propage déjà les rejets de promesse, mais on garde ce wrapper
// explicite pour rester lisible et compatible si l'on repasse en Express 4.
module.exports = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
