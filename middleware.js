const Listing = require('./models/listing');
const Review=require('./models/review');
const ExpressError = require('./utils/ExpressError');//validation middleware
const { listingSchema } = require('./schema');
const { reviewSchema } = require('./schema');




module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash('error',"please login to proceed");
        return res.redirect('/login');
    }
        next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
        delete req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (String(listing.owner) !== String(req.user._id)) {
            req.flash('error', "You don't have the permission");
            return res.redirect(`/listings/${id}`);
        }
    next()

}


module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
        console.log(error);
        if (error) {
            throw new ExpressError(400, error.details.map(el => el.message).join(','));
        }
        else {
            next();
        }
    }

    //validation middleware for review

    module.exports.validateReview = (req, res, next) => {
        let { error } = reviewSchema.validate(req.body);
            console.log(error);
            if (error) {
                throw new ExpressError(400, error.details.map(el => el.message).join(','));
            }
            else {
                next();
            }
        }

module.exports.isAuthor=async(req,res,next)=>{
    const {id , reviewId } = req.params;
    const review = await Review.findById(reviewId);    
    if (String(review.author) !== String(res.locals.currentUser._id)) {
            req.flash('error', "You don't have the permission");
            return res.redirect(`/listings/${id}`);
        }
    next()

}