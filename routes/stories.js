const express = require('express');
const router = express.Router();
const storiesController = require('../controller/stories')
const { ensureAuthenticated } = require('../helpers/auth')

// Stories Index
router.get('/', storiesController.getStories);

router.get('/my', ensureAuthenticated, storiesController.getMyStory)

router.get('/show/:id', storiesController.showStories)

router.get('/edit/:id', ensureAuthenticated, storiesController.getEditStory)

router.get('/user/:userId', storiesController.getUserStory)

router.put('/:id', ensureAuthenticated, storiesController.postEditStoy)

router.delete('/:id', ensureAuthenticated, storiesController.deleteStory)

router.post('/', storiesController.postAddStory)

router.get('/add', ensureAuthenticated, storiesController.getAddStories);

router.post('/comment/:id', storiesController.PostComments)


module.exports = router


