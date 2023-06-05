var admin = require("firebase-admin");

var serviceAccount = require("./random-chat-7aff8-firebase-adminsdk-wgxrv-f4ba5ab257.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
