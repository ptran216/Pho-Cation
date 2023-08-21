const express = require('express');
const router = express.Router();
const phorestaurants = require('../controllers/phorestaurants');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validatePhorestaurant } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Phorestaurant = require('../models/phorestaurant');


router.route('/')
    .get(catchAsync(phorestaurants.index))
    .post(isLoggedIn, upload.array('image'), validatePhorestaurant, catchAsync(phorestaurants.createPhorestaurant))


router.get('/new', isLoggedIn, phorestaurants.renderNewForm)

router.route('/:id')
    .get(catchAsync(phorestaurants.showPhorestaurant))
    .put(isLoggedIn, isAuthor, upload.array('image'), validatePhorestaurant, catchAsync(phorestaurants.updatePhorestaurant))
    .delete(isLoggedIn, isAuthor, catchAsync(phorestaurants.deletePhorestaurant));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(phorestaurants.renderEditForm))



module.exports = router;