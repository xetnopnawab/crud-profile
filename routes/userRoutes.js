var express = require('express');
var router = express.Router();

const { check } = require('express-validator');

const { 
  homepageRoute,
  signupRoute,
  signinRoute,
  editprofileRoute,
  resetpasswordRoute,
  forgetpasswordRoute,
  deleteprofileRoute,
  uploadimageRoute
} = require('../controller/userControllers');

const  { isLoggedIn } = require('./utility/verifyToken');
 
/**
 * @route POST /users
 * @desc Testing Home Route
 * @access Private
 */
router.post('/', isLoggedIn, homepageRoute);

/**
 * @route POST /users/signup
 * @desc let the user register on CRM
 * @access Public
 */
router.post('/signup', [
  check('username', 'Username must have atleast 4 characters, spaces not allowed').isLength({min: 4}).matches(/^[\S]+$/),
  check('email', 'Invalid email address').isEmail(),
  check('password', 'Password must have atleast 6 characters').isLength({min: 6})
], signupRoute);

/**
 * @route POST /users/signin
 * @desc let the user signin in CRM
 * @access Public
 */
router.post('/signin', signinRoute);


/**
 * @route POST /users/editprofile
 * @desc let the user edit his/her profile details
 * @access Private
 */
router.post('/editprofile', [
  check('username', 'Username must have atleast 4 characters, spaces not allowed').isLength({min: 4}).matches(/^[\S]+$/),
  check('email', 'Invalid email address').isEmail(),
  check('name', 'Name must have atleast 4 characters').isLength({min: 4}),
  check('contact', 'Contact must have atleast 10 characters').isLength({min: 10}),
  check('about', 'About must have atleast 10 characters').isLength({min: 10}),
  check('address', 'Address must have atleast 10 characters').isLength({min: 10}),
] , isLoggedIn, editprofileRoute);

/**
 * @route POST /users/resetpassword
 * @desc let the user reset it's password
 * @access Private
 */
router.post('/resetpassword', [
  check('newpassword', 'Password must have atleast 6 characters').isLength({min: 6})
], isLoggedIn, resetpasswordRoute);


/**
 * @route POST /users/forgetpassword
 * @desc let the user change the password with email
 * @access Public
 */
router.post('/forgetpassword', [
  check('email', 'Enter valid email address').isEmail()
], forgetpasswordRoute);


/**
 * @route POST /users/deleteprofile
 * @desc let the user delete the logged in user
 * @access Private
 */
router.post('/deleteprofile', isLoggedIn, deleteprofileRoute);

/**
 * @route POST /users/uploadimage
 * @desc let the user upload the profile picture
 * @access Private
 */
router.post('/uploadimage', isLoggedIn, uploadimageRoute);

module.exports = router;
