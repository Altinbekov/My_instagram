const express = require("express");
const router = express.Router();
const User = require("../model/User");

const bcrypt = require("bcrypt");

router.post("/create", async (req, res) => {
  try {
    if (req.body.password != req.body.Confirm_password) {
      console.log("password doesn't match");
      return res.send({ error: "password doesn't match" });
    }

    let { username, name, email, password } = req.body;

    if (!(username && email && password && name)) {
      return res.status(400).send({ error: "There must be every input." });
    }

    let olduser = await User.findOne({ email });

    if (olduser) {
      console.log("old user");
      return res.send({ error: "user had previously registered" });
    }

    encryptedUserPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: username,
      name: name,
      email: email,
      password: encryptedUserPassword,
    });
    return res.send({ success: "good to go" });
  } catch (err) {
    console.log(err);
    res.redirect("back");
  }
});

router.post("/create-session", async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;
    let user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.cookie("user_id", user._id);
      const localstore = user._id;
      console.log(localstore);
      const userid = user._id;
      const name = user.name;
      return res.send({ localstore, user: { userid, name, email } });
    } else {
      return res.send({ error: "error u have to first signup" });
    }
  } catch (err) {
    return res.send("error");
  }
});

router.get("/profile", async (req, res) => {
  if (req.cookies.user_id) {
    const { user_id } = req.cookies;
    let user = await User.findOne({ _id: user_id }).populate("chats");
    res.send("move to profile page");
  } else {
    return res.redirect("./Signin");
  }
});

module.exports = router;
