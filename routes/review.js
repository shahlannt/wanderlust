const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const {isLoggedIn, validateReview ,isAuthor}=require('../middleware')
const reviewController = require('../controllers/review');





//add review route
router.post('/', isLoggedIn, validateReview, wrapAsync(reviewController.addReview));


//delete review route
router.delete('/:reviewId', isLoggedIn, isAuthor, wrapAsync(reviewController.deleteReview));


module.exports = router;