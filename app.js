const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const {validCampSchema, validReviewSchema} = require('./validSchemas');
const Review = require('./models/review');
const campgrounds = require('./routes/campgrounds');

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
app.use('/campgrounds', campgrounds)

const validateReview = (req, res, next) => {
    const {error} = validReviewSchema.validate(req.body);
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



app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    console.log(req.body.review)
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    console.log(camp)
    res.redirect(`/campgrounds/${camp._id}`)
}));

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`)
}));

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
