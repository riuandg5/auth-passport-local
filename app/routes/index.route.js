// express router configuration
var express = require("express"),
    router  = express.Router();
// require passport for authentication
var passport = require("passport");
// require request
var request  = require("request");
// require models
var User = require("../models/User.model");
// require middleware
var middleware = require("../middleware");
// root route to homepage
router.get("/", function(req, res){
    res.render("home");
});
// route to secret page which is accessible only when signed in
router.get("/secret", middleware.isLoggedIn, function(req, res){
    res.render("secret");
});
// route to signup form
router.get("/signup", function(req, res){
   res.render("signup"); 
});
// route to post signup form data to database and register user
router.post("/signup", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            res.redirect("/signup");
        } else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Successfully signed up!");
                res.redirect("/");
            });
        }
    });
});
// route to signin form
router.get("/signin", function(req, res){
   res.render("signin"); 
});
// route to post signin form data
router.post("/signin",
    passport.authenticate(
        "local",
        {
            successRedirect: "/",
            failureRedirect: "/signin",
            failureFlash: "Signin failed!",
            successFlash: "Successfully signed in!"
        }
    ), function(req, res){
});
// route to password reset form
router.get("/reset", middleware.isLoggedIn, function(req, res){
   res.render("reset");
});
// route to post password reset form and change password
router.post("/reset", function(req, res){
    User.findById(req.body.uid, function(err, user){
        if(err){
            console.log(err);
        } else if(user){
            user.setPassword(req.body.newpwd, function(err, user){
                if(err){
                    console.log(err);
                }
                user.save(function(err){
                    if(err){
                        console.log(err);
                    }
                    req.flash("success", "Successfully changed password!");
                    res.redirect("/");
                });
            });
        } else {
            req.flash("error", `No user found by id : ${req.body.uid}`);
            res.redirect("/reset");
        }
    });
});
// route to signout
router.get("/signout", function(req, res){
    req.logout();
    req.flash("success", "Successfully signed out!");
    res.redirect("/");
});
// export express router to use in main app
module.exports = router;