const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

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
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);


let year = new Date().getFullYear();

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
