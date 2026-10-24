const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
const userController = require('../controllers/user');

//signup  route

router.route('/signup')
.get( wrapAsync(userController.signupForm))
.post(wrapAsync(userController.signup));

//login route
router.route('/login')
.get( wrapAsync(userController.loginForm))
.post(saveRedirectUrl, passport.authenticate('local', 
    { failureRedirect: '/login',
         failureFlash: true 
    }),
    wrapAsync(userController.login));

// logout route
router.get('/logout', wrapAsync(userController.logout));


module.exports = router;