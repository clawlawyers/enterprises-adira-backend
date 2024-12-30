const express = require("express");
const { ServerConfig, ConnectDB } = require("./src/config");
const apiRoutes = require("./src/routes");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const cron = require("node-cron"); // Add this line
// require("./src/config/prisma-client");
const { DbAutomationService } = require("./src/services");

app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use("/api", apiRoutes);

app.use("", (req, res) => {
  res.status(200).json({
    message: "Server is live.",
  });
});

// Schedule task to run every minute (for testing purposes)
cron.schedule("0 1 * * *", async () => {
  console.log("Running scheduled task to handle expired plans");
  await DbAutomationService.deleteExpiredPlans();
});

app.listen(ServerConfig.PORT, async () => {
  //mongoDB connection
  await ConnectDB();
  console.log(`Server is up at ${ServerConfig.PORT}`);
});
