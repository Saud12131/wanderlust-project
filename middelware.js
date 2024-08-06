const ExpressError = require("./utils/Expresserror.js");
const Listing = require("./models/listings");
const Review = require("./models/reviewSchema.js");
const {listingSchema,} = require("./schema.js");
const {reviewschema } = require("./schema.js");


module.exports.isLoggedIn = (req, res, next) => {
    req.session.redirectUrl = req.originalUrl;
    if (!req.isAuthenticated()) {
        req.flash("error", "You must log in first");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next) => {
if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
}
next();
} 

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(',');
        return next(new ExpressError(400, message));
        console.log(error);
    }
    next();
};

module.exports.isOwner = async(req,res,next)=>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner.equals(res.locals.curuser._id)){
    req.flash("error","Only owner can edit this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.validatereview = (req, res, next) => {
    const { error } = reviewschema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(',');
        next(new ExpressError(400, message));
    } else {
        next();
    }
};


module.exports.isreviewauthor = async(req,res,next)=>{
    let {id ,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.curuser._id)){
      req.flash("error","only owner can modify this listing");
      return res.redirect(`/listings/${id}`);
    }
    next();
  }