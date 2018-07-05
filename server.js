var port  = process.env.PORT || 3079,
    dburi = process.env.DBURI || "mongodb://localhost/auth_sample";
// require npm packages
var express       = require("express"),
    mongoose      = require("mongoose"),
    bodyParser    = require("body-parser"),
    flash         = require("connect-flash"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    app           = express();
// require models
var User          = require("./app/models/User.model");
// require routes
var indexRoute    = require("./app/routes/index.route");
// tell mongoose to use bluebird or native ES6 promise library
// mongoose.Promise = global.Promise; // native ES6 promise library
mongoose.Promise = require('bluebird');
// connect to database
mongoose.connection.openUri(dburi);
// set views directory path
app.set("views", "./app/views");
// set templating engine to ejs
app.set("view engine", "ejs");
// host static files (public directory) with express
app.use(express.static("public"));
// passport configuration
app.use(require("express-session")({
    secret: "thisissecretstring",
    cookie: {maxAge: 12*60*60*1000},
    resave: false,
    saveUninitialized: false
}));
app.use(flash()); // use flash for flash messages
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// middleware to send variables to every template page
app.use(function(req, res, next){
    // set currentUser to req.user
    res.locals.currentUser = req.user;
    // success and error message variables for flash
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});
// use body-parser
app.use(bodyParser.urlencoded({extended: true}));
// use routes
app.use(indexRoute);
// listen to the port
app.listen(port, function(){
    console.log("Server started...");
})