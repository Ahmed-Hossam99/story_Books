const passport = require('passport');
const UserModle = require('../models/User')
const StoryModle = require('../models/Story')

// get Index
exports.getIndex = (req, res) => {
  res.render('index/welcome')
}

// get dashboard
exports.getDashboard = (req, res) => {
  StoryModle.find({ user: req.user.id })
    .then(stories => {
      res.render('index/dashboard', {
        stories: stories
      });
    })
}

exports.getAbout = (req, res) => {
  res.render('index/about');
}

