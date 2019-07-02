const User = require('../models/user');

exports.userSignUp = async (req, res) => {
  const user = new User({ email: req.body.email, password: req.body.password });
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token, message: 'User created successfully' });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.userLogIn = async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.status(200).send({ token, expiresIn: 3600, userId: user._id });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.userLogOut = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return req.token !== token.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
};
