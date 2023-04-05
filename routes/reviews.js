const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const {validReviewSchema} = require('../validSchemas');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review');

let year = new Date().getFullYear();

const validateReview = (req, res, next) => {
    const {error} = validReviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, msg)
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success', 'Created new review!')
    res.redirect(`/campgrounds/${camp._id}`)
}));

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review has been deleted')
    res.redirect(`/campgrounds/${id}`)
}));

module.exports = router;