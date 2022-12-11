const express = require('express');
const router = express.Router();
const { verify } = require('../authorization');
const { getConvo, sendMsg } = require('../controllers/chatController');

router.get('/conversation', verify, getConvo);
router.post('/conversation', verify, sendMsg);

module.exports = router;
