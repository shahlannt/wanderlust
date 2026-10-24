const Review=require('../models/review');
const Listing=require('../models/listing');


//add review

module.exports.addReview = async (req, res,next) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    const { rating, body } = req.body.review;
    // Handle review creation logic here
    const newReview = new Review({ rating, comment: body ,author : req.user._id});
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    req.flash('success', 'Review added successfully!');
    res.redirect(`/listings/${listing._id}`);
}

//delete 

module.exports.deleteReview = async (req, res,next) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted successfully!');
    res.redirect(`/listings/${id}`);
}