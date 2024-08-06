const Listing = require("../models/listings");

module.exports.indexroute = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.newlisting = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showroute = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({
        path: "reviews", populate: {
            path: "author",
        }
    }).populate("owner");
    if (!listing) {
        req.flash("error", "The listing you want to access does not exsist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}

module.exports.createroute = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    console.log(newListing.image);
    req.flash("success", "new listing created");
    res.redirect("/listings");
}


module.exports.editlisting = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "The listing you want to access does not exsist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}

module.exports.updatelisting = async (req, res) => {
    let { id } = req.params;
    const updatedData = req.body.listing;
    let listing = await Listing.findByIdAndUpdate(id, updatedData);
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", " listing updated");
    res.redirect(`/listings/${id}`);
}

module.exports.deletelisting = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", " listing deleted");
    res.redirect("/listings");
}

module.exports.search = async (req, res) => {
    const searchTerm = req.query.q || '';
    try {
        const results = await Listing.find({
            title: { $regex: searchTerm, $options: 'i' }
        });
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};  