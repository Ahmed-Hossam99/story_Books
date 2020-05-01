const express = require('express');
const indexController = require('../controller/index')
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth')
const router = express.Router();


router.get('/', ensureGuest, indexController.getIndex);
router.get('/dashboard', ensureAuthenticated, indexController.getDashboard);

router.get('/about', indexController.getAbout);



module.exports = router;