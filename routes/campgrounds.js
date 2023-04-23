const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCamp } = require('../middleware');
const camps = require('../controllers/camps');

router.route('/')
    .get(catchAsync(camps.index))
    .post(isLoggedIn, validateCamp, catchAsync(camps.createCamp))

router.get('/new', isLoggedIn, camps.renderNewForm);

router.route('/:id')
    .get(catchAsync(camps.showCamp))
    .put(isLoggedIn, validateCamp, isAuthor, catchAsync(camps.updateCamp))
    .delete(isLoggedIn, isAuthor, catchAsync(camps.deleteCamp))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(camps.renderEditForm));

module.exports = router;