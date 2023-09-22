if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const ExpressError = require('../utils/ExpressError');
const User = require('../models/user');

const campgroundRoutes = require('../routes/campgrounds');
const reviewRoutes = require('../routes/reviews');
const userRoutes = require('../routes/users')

// mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
mongoose.connect(process.env.DB_URL)

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'CONNECTION ERROR:'));
db.once('open', () => {
    console.log('DATABASE CONNECTED')
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/style'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
const sessionConfig = {
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + (1000 * 60 * 60 * 4),
        maxAge: 1000 * 60 * 60 * 4
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
// passport.session must come after sessionConfig
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

let year = new Date().getFullYear();

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    res.locals.year = year;
    next();
})

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/' , userRoutes);


app.get('/', (req, res) => {
    res.render('home', {year})
});

app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page Not Found'))
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "OH NO! SOMETHING WENT TERRIBLY WRONG!" } = err;
    res.status(statusCode).render('error', {year, err})
});

app.listen(3000, () => {
    console.log('SERVER LIVE ON PORT 3000')
});
