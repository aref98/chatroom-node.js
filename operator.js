const express = require('express');

const operatorController = require('../controllers/operator');

const router = express.Router();

router.get('/signin',operatorController.getSignin);
router.post('/signin',operatorController.postSignin);

///////

router.get('/signup',operatorController.getSignup);
router.post('/signup',operatorController.postSignup);

module.exports = router;
