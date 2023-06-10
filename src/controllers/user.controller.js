const User = require("../models/user.model");
const mongoose = require("mongoose");
const admin = require("../configs/firebase.config");
const { jwtSecret } = require("../configs/server");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.json({ message: "Unauthorized" });
    }
    const decodeValue = await admin.auth().verifyIdToken(token);
    if (decodeValue) {
      const uid = decodeValue.uid;
      const { deviceToken } = req.body;
      User.findOneAndUpdate(
        { userId: uid },
        { deviceToken, jwtUpdated: new Date() },
        { new: true }
      )
        .then((user) => {
          if (user) {
            let { __v, deviceToken, _id, jwtUpdated, ...userDetails } = {
              ...user._doc,
            };
            const token = jwt.sign({ uid, deviceToken, jwtUpdated }, jwtSecret);
            return res.status(200).json({
              user: userDetails,
              token,
            });
          } else {
            return res.status(200).json({
              message: "User does not exist",
            });
          }
        })
        .catch((error) => {
          return res.status(500).json({
            message: "An error occurred while updating the device token",
          });
        });
    }
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.signUp = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.json({ message: "Unauthorized" });
    }
    const decodeValue = await admin.auth().verifyIdToken(token);
    if (decodeValue) {
      const { uid, email } = decodeValue;
      const { deviceToken } = req.body;
      const newUser = new User({
        userId: uid,
        email: email,
        deviceToken: deviceToken,
        jwtUpdated: new Date(),
      });
      newUser.save((err, user) => {
        if (err) {
          return res.status(200).json({ message: "DB Error" });
        } else {
          let { __v, deviceToken, _id, jwtUpdated, ...userDetails } = {
            ...user._doc,
          };
          const token = jwt.sign({ uid, deviceToken, jwtUpdated }, jwtSecret);
          return res.status(200).json({
            user: userDetails,
            token,
          });
        }
      });
    }
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};
