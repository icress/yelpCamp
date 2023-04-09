const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

let year = new Date().getFullYear();


router.get('/register', (req, res) => {
    res.render('users/register', {year})
});

router.post('/register', catchAsync(async (req, res) => {
    try {
       const {email, username, password} = req.body;
    const user = new User({email, username});
    const registeredUser = await User.register(user, password); 
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
    req.flash('success', 'Welcome to YelpCamp!')
}));

module.exports = router;