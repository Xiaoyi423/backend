const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const check = await User.findOne({ username });
    if (check) {
      return res.status(403).json({
        msg: 'Username already exists',
      });
    }
    const cryptedPassword = await bcrypt.hash(password, 10);

    const user = await new User({
      username: username,
      password: cryptedPassword,
    }).save();

    const accessToken = jwt.sign(
      { id: user._id.toString() },
      process.env.TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      id: user._id,
      username: user.username,
      token: accessToken,
      msg: 'Register Success',
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const check = await User.findOne({ username });
    if (!check) {
      return res.status(401).json({
        msg: 'Incorrect Password/Username',
      });
    }
    const check_password = await bcrypt.compare(password, check.password);
    if (!check_password) {
      return res.status(401).json({
        msg: 'Incorrect Password/Username',
      });
    }
    const accessToken = jwt.sign(
      { id: check._id.toString() },
      process.env.TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    res.send({
      id: check._id,
      username: check.username,
      token: accessToken,
      msg: 'Log in Success',
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
