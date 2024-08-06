const User = require("../models/user");
const passport = require("passport");

module.exports.signupget =  (req, res) => {
    res.render("users/signup");
}

module.exports.signuppost = async (req, res,next) => {
    try {
        let { username, email, password } = req.body;
        const newuser = new User({ username, email });
        const registerduser = await User.register(newuser, password);
        console.log(registerduser);
       req.login(registerduser,(err)=>{
        if(err){
           return next(err);
        }
        req.flash("success", "account created");
        res.redirect("/listings");
       });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.loginget = (req, res) => {
    res.render("users/login");
}

module.exports.login  = async (req, res) => {
    req.flash("success", "welcome to wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "logged out");
        res.redirect("/listings");
    });
}