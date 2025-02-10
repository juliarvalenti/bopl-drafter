const { execSync } = require("child_process");
const os = process.platform;

try {
  if (os === "win32") {
    console.log("Running install on Windows...");
    execSync("cd server && npm install", { stdio: "inherit" });
    execSync("cd client && npm install", { stdio: "inherit" });
    execSync("cd client && npm run build", { stdio: "inherit" });
    execSync("cd server && npm run build", { stdio: "inherit" });
  } else {
    console.log("Running install on Linux/Heroku...");
    execSync("npm run install-all && npm run build-all", { stdio: "inherit" });
  }
} catch (error) {
  console.error("Postinstall script failed:", error);
  process.exit(1);
}
