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
            console.log(err);
            return res.render('signup');
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/");
        });
    });
});
// route to signin form
router.get("/signin", function(req, res){
   res.render("signin"); 
});
// route to post signin form data
router.post("/signin", passport.authenticate("local", {successRedirect: "/", failureRedirect: "/signin"}), function(req, res){
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
        }
        user.setPassword(req.body.newpwd, function(err, user){
            if(err){
                console.log(err);
            }
            user.save(function(err){
                if(err){
                    console.log(err);
                }
                res.redirect("/signout");
            });
        });
    });
});
// route to signout
router.get("/signout", function(req, res){
    req.logout();
    res.redirect("/");
});
// export express router to use in main app
module.exports = router;