if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}
const express = require("express");
const router = express.Router();
const Listing = require("../models/listings");
const wrapAsync = require("../utils/wrapasync.js");
const { isLoggedIn, validateListing, isOwner } = require("../middelware.js");
const listingController = require("../controller/listing.js");
const multer = require("multer");
const { storage } = require("../cloudconifg.js")
const upload = multer({ storage })


// Index route
router.get("/", wrapAsync(listingController.indexroute));


// New route
router.get("/new", isLoggedIn, listingController.newlisting);


// Show route
router.get("/:id", wrapAsync(listingController.showroute));

// Create route
router.post("/",upload.single("listing[image]"),wrapAsync(listingController.createroute));

// Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editlisting));

// Update route
router.put("/:id", isLoggedIn,upload.single("listing[image]"), wrapAsync(listingController.updatelisting));

// Delete route
router.delete("/:id", isLoggedIn, wrapAsync(listingController.deletelisting));

// Search route
router.get('/search', isLoggedIn, wrapAsync(listingController.search));

module.exports = router;
