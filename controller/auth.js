const passport = require('passport');
const UserModle = require('../models/User')


// get verify 
exports.getVerify = (req, res) => {
  if (req.user) {
    console.log(req.user)

  } else {
    console.log('not Auth')

  }
}

// get logout 
exports.getLogout = (req, res) => {
  req.logOut();
  res.redirect('/')
}