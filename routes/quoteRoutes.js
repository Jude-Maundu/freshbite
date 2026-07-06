const express = require('express');
const { getQuotes, createQuote } = require('../controllers/quoteController');
const requireAdminAuth = require('../middleware/requireAdminAuth');

const router = express.Router();

router.get('/', requireAdminAuth, getQuotes);
router.post('/', createQuote);

module.exports = router;
