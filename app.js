const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/Expresserror.js");
const listingsrouter = require("./routes/listing.js");
const reviewsrouter = require("./routes/reviews.js");
const userrouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const { date } = require("joi");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const user = require("./models/user.js");
const User = require("./models/user.js");
const { log } = require("console");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dburl = process.env.ATLASDB_URL;

mongoose.connect(dburl)
    .then(() => {
        console.log("Connected to database");
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret: process.env.SECRET,
    },
     touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("ERROR ON MONGO SESSION STORE", err);
})

const sessionoption = {
   store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 100,
        maxAge: 7 * 24 * 60 * 60 * 100,
        httpOnly: true,
    },
};

app.use(session(sessionoption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curuser = req.user;
    next();
})

app.use("/listings", listingsrouter);
app.use("/listings/:id/reviews", reviewsrouter);
app.use("/", userrouter);

//--------------------------------------
//middelwares
app.all("*", (req, res, next, err) => {
    next(new ExpressError(404, "Page not found"))
    console.log(err);
});

//Error-handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { statusCode, message });
    console.log(err);
});

app.listen(8080, () => {
    console.log(`Server is listening on port 8080`);
});
