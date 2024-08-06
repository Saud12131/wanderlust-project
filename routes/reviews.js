const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapasync.js");
const {validatereview, isLoggedIn, isreviewauthor} = require("../middelware.js");
const reviewcontroller = require("../controller/review.js")

//post route
router.post("/",isLoggedIn, validatereview, wrapAsync(reviewcontroller.postreview));

// delete review route
router.delete("/:reviewId",isLoggedIn ,isreviewauthor,wrapAsync(reviewcontroller.deletereview));

module.exports = router;
