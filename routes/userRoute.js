const express = require('express');
const authController = require('../controllers/authControl');
const userController = require('../controllers/userController');
const userRouter = express.Router();

userRouter.route('/signup').post(authController.signUp);
userRouter.route('/logIn').post(authController.logIn);
userRouter.route('/forgetPassword').post(authController.forgotPassword);
userRouter.route('/resetPassword/:token').patch(authController.resetPassword);
userRouter.route('/updatePassword').patch(authController.protect,authController.updatePassword);

userRouter.route('/').get(userController.getUsers);
userRouter.route('/profile').get(authController.protect,userController.getProfile).put(authController.protect,userController.updateProfile);
userRouter.route('/:id').delete(authController.protect,userController.deleteUser);

module.exports = userRouter;

