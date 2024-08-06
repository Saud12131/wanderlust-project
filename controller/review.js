const Listing = require("../models/listings");
const Review = require("../models/reviewSchema.js");
const user = require("../models/user.js");

module.exports.postreview  = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    await newReview.save();
    listing.reviews.push(newReview._id);
    await listing.save();
    console.log("New review saved");
    console.log(newReview);
    req.flash("success","new review created");
    res.redirect(`/listings/${listing._id}`)
}

module.exports.deletereview = async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success"," review deleted");
    res.redirect(`/listings/${id}`);
}