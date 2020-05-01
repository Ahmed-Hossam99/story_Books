const passport = require('passport');
const UserModle = require('../models/User')
const StoryModle = require('../models/Story')

// get index Stories
exports.getStories = (req, res) => {
  StoryModle.find({ status: 'public' })
    .populate('user')
    .then(stories => {
      res.render('stories/index', {
        stories: stories
      });
    });
}

exports.getAddStories = (req, res) => {
  res.render('stories/add');
}

exports.postAddStory = (req, res, next) => {
  let allowComments
  if (req.body.allowComments) {
    allowComments = true

  } else {
    allowComments = false
  }

  const newStory = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments: allowComments,
    user: req.user.id
  }

  new StoryModle(newStory)
    .save()
    .then(story => {
      // console.log(story.id)
      res.redirect(`/stories/show/${story.id}`)
    })

}

exports.showStories = (req, res) => {
  StoryModle.findOne({
    _id: req.params.id
  })
    .populate('user')
    .populate('comments.commentUser')
    .then(story => {
      if (story.status == 'public') {
        res.render('stories/show', {
          story: story
        });
      } else {
        if (req.user) {
          if (req.user.id == story.user._id) {
            res.render('stories/show', {
              story: story
            });
          } else {
            res.redirect('/stories');
          }
        } else {
          res.redirect('/stories');
        }
      }
    });
}

exports.getEditStory = (req, res) => {
  StoryModle.findOne({
    _id: req.params.id
  })
    .then(story => {
      if (story.user.toString() !== req.user._id.toString()) {
        return res.redirect('/stories');
      }
      res.render('stories/edit', {
        story: story
      });
    });

}

exports.postEditStoy = (req, res) => {
  storyId = req.params.id

  StoryModle.findOne({ _id: storyId })
    .then(story => {
      if (!story) {
        res.redirect('/dashboard')
      }
      let allowComments
      if (req.body.allowComments) {
        allowComments = true

      } else {
        allowComments = false
      }
      story.title = req.body.title
      story.body = req.body.body
      story.status = req.body.status
      story.allowComments = allowComments
      story.user = req.user.id
      story.save();
      res.redirect('/dashboard');
    }).catch(err => console.log(err))
}

exports.deleteStory = (req, res) => {
  StoryModle.deleteOne({ _id: req.params.id })
    .then(() => {
      res.redirect('/dashboard')
    })
}

exports.PostComments = (req, res) => {
  StoryModle.findOne({ _id: req.params.id })
    .then(story => {
      const newComment = {
        commentBody: req.body.commentBody,
        commentUser: req.user.id
      }
      // add new comment to array
      story.comments.unshift(newComment)
      story.save()
        .then(story => {
          console.log(newComment.commentUser)
          res.redirect(`/stories/show/${story.id}`)
        })
    })
}

exports.getUserStory = (req, res) => {
  StoryModle.find({ user: req.params.userId, status: 'public' })
    .populate('user')
    .then(stories => {
      res.render('stories/index', {
        stories: stories
      })
    })
}

exports.getMyStory = (req, res) => {
  StoryModle.find({ user: req.user.id })
    .populate('user')
    .then(stories => {
      res.render('stories/index', {
        stories: stories
      })
    })

}
