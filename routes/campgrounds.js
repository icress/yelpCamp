const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor, validateCamp} = require('../middleware');
const camps = require('../controllers/camps');

router.get('/', catchAsync(camps.index));

router.get('/new', isLoggedIn, camps.renderNewForm);

router.post('/', isLoggedIn, validateCamp, catchAsync(camps.createCamp));

router.get('/:id', catchAsync(camps.showCamp));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(camps.renderEditForm));

router.put('/:id', isLoggedIn, validateCamp, isAuthor, catchAsync(camps.updateCamp));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(camps.deleteCamp));

module.exports = router;