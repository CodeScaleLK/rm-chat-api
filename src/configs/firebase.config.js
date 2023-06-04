var admin = require("firebase-admin");

var serviceAccount = require("./random-chat-7aff8-firebase-adminsdk-wgxrv-375f511f95.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
