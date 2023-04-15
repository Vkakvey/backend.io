const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { fullname, email, password } = req.body;
  try {
    const isEmail = await User.findOne({ email });
    if (isEmail)
      return res.status(400).json({ msg: "this email is already exist!" });
    const newUser = new User({
      fullname,
      email,
      password,
    });
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) return res.status(400).json({ msg: "error" });
        newUser.password = hash;
        newUser.save().then((user) => res.json(user));
      });
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: "server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const isEmail = await User.findOne({ email });
    if (!isEmail)
      return res.status(400).json({ msg: "this email is not registered" });
    const isMatch = bcrypt.compare(password, isEmail.password);
    const payload = {
      user: {
        id: isEmail.id,
        email: isEmail.email,
        fullname: isEmail.fullname,
      },
    };
    if (isMatch) {
      const token = jwt.sign({ payload }, process.env.SECRET_KEY, {
        expiresIn: 36000,
      });
      await res.status(200).json({
        token: token,
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: "server error" });
  }
};
