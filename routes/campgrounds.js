const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const {validCampSchema} = require('../validSchemas');


const validateCamp = (req, res, next) => {
    const {error} = validCampSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400, msg)
    } else {
        next();
    }
}

let year = new Date().getFullYear();

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds, year})
}));

router.get('/new', (req, res) => {
    res.render('campgrounds/new', {year})
});

router.post('/', validateCamp, catchAsync(async (req, res) => {  
    const camp = new Campground(req.body.campground);
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`)
}));

router.get('/:id', catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', {camp, year})
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', {camp, year})
}));

router.put('/:id', validateCamp, catchAsync(async (req, res) => {
    const camp = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground});
    res.redirect(`/campgrounds/${camp._id}`)
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

module.exports = router;