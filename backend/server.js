const { port, nodeEnv } = require("./config/env");
const { connectDB } = require("./config/db");
const app = require("./app");

async function start() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`API Office Management sur http://localhost:${port} (${nodeEnv})`);
    });
  } catch (err) {
    console.error("Démarrage impossible :", err.message);
    process.exit(1);
  }
}

start();
