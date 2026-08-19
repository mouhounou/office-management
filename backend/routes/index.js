const express = require("express");
const authRoutes = require("./auth.routes");

const router = express.Router();

router.get("/health", (_req, res) => res.json({ status: "ok", uptime: process.uptime() }));
router.use("/auth", authRoutes);

module.exports = router;
