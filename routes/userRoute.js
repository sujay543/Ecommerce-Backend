const express = require('express');
const authController = require('../controllers/authControl');
const userController = require('../controllers/userController');
const userRouter = express.Router();

userRouter.route('/signup').post(authController.signUp);
userRouter.route('/logIn').post(authController.logIn);
userRouter.route('/forgetPassword').post(authController.forgotPassword);

userRouter.route('/').get(userController.getUsers);
module.exports = userRouter;

