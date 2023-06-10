require("dotenv").config();
require("./src/services/updateChatList");
const fs = require("fs");
const https = require("https");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./src/routes/auth.route");
const trialRoutes = require("./src/routes/trial.route");
const chatRoutes = require("./src/routes/chat.route");

const authMiddleware = require("./src/middleware/auth.middleware");
const { MONGO_URL, PORT } = require("./src/configs/server");

const app = express();
const port = PORT;

app.use(
  cors({
    origin: "*",
  })
);

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// connect to mongoDB
main().catch((err) => console.log(err));
async function main() {
  mongoose.set("strictQuery", false);
  await mongoose.connect(MONGO_URL);
}

app.use("/auth", authRoutes);
app.use("/trial", trialRoutes);
app.use("/chat", authMiddleware, chatRoutes);

app.listen(port, () => {
  console.log(`server started in port ${port}`);
});

// const options = {
//   cert: fs.readFileSync("/etc/letsencrypt/live/rm.codescale.cc/fullchain.pem"),
//   key: fs.readFileSync("/etc/letsencrypt/live/rm.codescale.cc/privkey.pem"),
// };

// https.createServer(options, app).listen(443);
