const express = require('express'),
  userRouter = express.Router(),
  auth = require('../middleware/auth'),
  UserController = require('../controllers/users');

userRouter.post('/signup', UserController.userSignUp);

userRouter.post('/login', UserController.userLogIn);

userRouter.post('/logout', auth, UserController.userLogOut);

module.exports = userRouter;
