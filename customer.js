const express = require('express');

const customerController = require('../controllers/customer');

const router = express.Router();

router.get('/signin',customerController.getSignin);
router.post('/signin',customerController.postSignin);

///////

router.get('/signup',customerController.getSignup);
router.post('/signup',customerController.postSignup);
//////
router.post('/needs-operator',customerController.getOperator);

module.exports = router;
