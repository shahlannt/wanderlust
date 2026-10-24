const User = require('../models/user');


// sign up form

module.exports.signupForm =  async (req, res) => {
    res.render('users/signup.ejs');
}

// signup

module.exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
        req.flash('success', 'Welcome to Wanderlust!');
        res.redirect('/listings');
        });
        
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
}

// login form

module.exports.loginForm = async (req, res) => {
    res.render('users/login.ejs');
}

//login 

module.exports.login = async (req, res) => {
    // Authentication logic will be handled by Passport.js middleware
    req.flash('success', 'Welcome back!');
    res.redirect(res.locals.redirectUrl || '/listings');
}


// logout

module.exports.logout = async (req, res) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/listings');
    });
}