const User = require("../models/user.model");
const mongoose = require("mongoose");

exports.login = async (req, res) => {
  try {
    const { uid } = res.locals.user;
    const { deviceToken } = req.body;

    User.findOneAndUpdate({ userId: uid }, { deviceToken }, { new: true })
      .then((user) => {
        if (user) {
          let { __v, deviceToken, _id, ...userDetails } = { ...user._doc };
          return res.status(200).json({
            user: userDetails,
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
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.signUp = async (req, res) => {
  try {
    const email = res.locals.user.email ? res.locals.user.email : "";
    const userId = res.locals.user.uid;
    const { deviceToken } = req.body;
    const newUser = new User({
      userId: userId,
      email: email,
      deviceToken: deviceToken,
    });
    newUser.save((err, user) => {
      if (err) {
        return res.status(200).json({ message: "DB Error" });
      } else {
        let { __v, deviceToken, _id, ...userDetails } = { ...user._doc };
        return res.status(200).json({
          user: userDetails,
        });
      }
    });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};
