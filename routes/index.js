var express = require('express');
var router = express.Router();
const userModel = require('./users');
const passport = require('passport');
const mongoose = require('mongoose');
const localStrategy = require('passport-local');
const upload = require("./multer");

passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/registor', function (req, res, next) {
  res.render('registor');
});
router.get('/login', function (req, res, next) {
  res.render('login');
});


router.post('/registor', function (req, res) {
  var data = new userModel({
    email: req.body.email,
    username: req.body.username,
    name: req.body.name,
    secret: req.body.secret,
  });

  userModel.register(data, req.body.password)
    .then(function (registereduser) {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile");
      })
    })
});

router.post('/login', passport.authenticate("local", {
  failureMessage: "Login failed",
  // failureRedirect: "/",
  successRedirect: "/profile",
}), function (req, res) { })

router.get('/logout', function (req, res, next) { 
  // req.logout(function (err) { 
  //   if (err) { 
  //     return next(err); 
  //   } 
  //   res.redirect('/'); 
  req.session.destroy(function (err) {
    res.redirect('/');
  }); 
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

router.get("/profile", isLoggedIn,async function (req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user});
  res.render('profile' , {user});
});

router.post("/fileupload", isLoggedIn, upload.single("image"), async function (req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user});
  user.profileImage = req.file.filename;
  await user.save();
  res.redirect("/profile");
});

router.post("/pinupload", isLoggedIn, upload.single("image"), async function (req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user});
  user.boards[push] = req.file.filename;
  await user.save();
  res.redirect("/profile");
});

module.exports = router;
