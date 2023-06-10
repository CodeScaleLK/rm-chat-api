const admin = require("../configs/firebase.config");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

async function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.json({ message: "Unauthorized" });
    }
    const decodeValue = jwt.decode(token);
    if (decodeValue) {
      const user = await User.findOne({
        userId: decodeValue.uid,
        deviceToken: decodeValue.deviceToken,
        jwtUpdated: decodeValue.jwtUpdated,
      });
      if (user) {
        res.locals.user = decodeValue;
        return next();
      }
    }
    return res.json({ message: "Unauthorized" });
  } catch (e) {
    console.log(e.message);
    return res.json({ message: "Internal Error" });
  }
}

module.exports = authMiddleware;
