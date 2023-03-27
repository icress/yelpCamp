const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const {validCampSchema} = require('./validSchemas');
const Review = require('./models/review')

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

const validateCamp = (req, res, next) => {
    const {error} = validCampSchema.validate(req.body);
    const msg = error.details.map(el => el.message).join(',')
    if (error) {
        throw new ExpressError(400, msg)
    } else {
        next();
    }
}

let year = new Date().getFullYear();

app.get('/', (req, res) => {
    res.render('home', {year})
});

app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds, year})
}));

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new', {year})
});

app.post('/campgrounds', validateCamp, catchAsync(async (req, res) => {  
    const camp = new Campground(req.body.campground);
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`)
}));

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    res.render('campgrounds/show', {camp, year})
}));

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', {camp, year})
}));

app.put('/campgrounds/:id', validateCamp, catchAsync(async (req, res) => {
    const camp = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground});
    res.redirect(`/campgrounds/${req.params.id}`)
}));

app.delete('/campground/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

app.post('/campgrounds/:id/reviews', catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    console.log(req.body.review)
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    console.log(camp)
    res.redirect(`/campgrounds/${camp._id}`)
}))

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
