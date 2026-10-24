const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync=require('../utils/wrapAsync');
const {isLoggedIn, isOwner,validateListing}=require('../middleware');
const listingController = require('../controllers/listing');
const multer  = require('multer');
const { storage } = require('../cloudConfig');
const upload = multer({ storage });





router.route('/')
.get( wrapAsync(listingController.index))//listing route
.post(isLoggedIn,upload.single('image'),validateListing,wrapAsync(listingController.createNew))//create  new listing

;

//add listing route
router.get('/new',isLoggedIn, wrapAsync(listingController.newForm));


router.route('/:id')
    .get(wrapAsync(listingController.viewListing))//view listing route
    .put( isLoggedIn, upload.single('image'),validateListing,isOwner,   
        wrapAsync(listingController.updateListing))  //update listing route)
    .delete( isLoggedIn,isOwner,
        wrapAsync(listingController.deleteListing))  //delete listing route
    ;

//edit listing route
router.get('/:id/edit',isLoggedIn,isOwner,
     wrapAsync(listingController.editForm));


module.exports = router;