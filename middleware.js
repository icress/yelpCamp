const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');
const {validCampSchema} = require('./validSchemas');
const {validReviewSchema} = require('./validSchemas');


const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Please login');
        return res.redirect('/login');
    }
    next();
}

const validateCamp = (req, res, next) => {
    const {error} = validCampSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400, msg)
    } else {
        next();
    }
}

const isAuthor = async(req, res, next) => {
    const {id} = req.params
    const camp = await Campground.findById(id);
    if (!camp.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to access that!');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

const isReviewAuthor = async(req, res, next) => {
    const {id, reviewId} = req.params
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to access that!');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

const validateReview = (req, res, next) => {
    const {error} = validReviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, msg)
    } else {
        next();
    }
}


module.exports.isLoggedIn = isLoggedIn;
module.exports.isAuthor = isAuthor;
module.exports.validateCamp = validateCamp;
module.exports.validateReview = validateReview;
module.exports.isReviewAuthor = isReviewAuthor;
