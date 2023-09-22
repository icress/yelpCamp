const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCamp } = require('../api/middleware');
const camps = require('../controllers/camps');
const multer  = require('multer');
const {storage} = require('../api/cloudinary');
const upload = multer({storage});

router.route('/')
    .get(catchAsync(camps.index))
    .post(isLoggedIn, upload.array('image'), validateCamp, catchAsync(camps.createCamp));


router.get('/new', isLoggedIn, camps.renderNewForm);

router.route('/:id')
    .get(catchAsync(camps.showCamp))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCamp, catchAsync(camps.updateCamp))
    .delete(isLoggedIn, isAuthor, catchAsync(camps.deleteCamp))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(camps.renderEditForm));

module.exports = router;