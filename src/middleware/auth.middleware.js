const admin = require("../configs/firebase.config");

async function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.json({ message: "Unauthorized" });
    }
    const decodeValue = await admin.auth().verifyIdToken(token);
    if (decodeValue) {
      res.locals.user = decodeValue;
      return next();
    }
    return res.json({ message: "Unauthorized" });
  } catch (e) {
    return res.json({ message: "Internal Error" });
  }
}

module.exports = authMiddleware;
