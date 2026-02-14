const express = require('express');
const userController = require('../controllers/authControl');
const userRouter = express.Router();

userRouter.route('/signup').post(userController.signUp);

module.exports = userRouter;

