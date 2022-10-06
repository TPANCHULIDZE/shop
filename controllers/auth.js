const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn
  console.log(isLoggedIn)
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticate: isLoggedIn
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  User
    .findOne({ email: email })
    .then(user => {
      if(user){
        req.session.user = user;
        req.session.isLoggedIn = true;
        res.redirect("/");
      } else {
        console.log('email not found')
        res.redirect('/login')
      }
    })
    .catch(err => {
      console.log(err);
    })
};

exports.postLogOut = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/')
  })
};
