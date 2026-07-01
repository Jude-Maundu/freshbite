const express = require('express');
const { getQuotes, createQuote } = require('../controllers/quoteController');

const router = express.Router();

router.get('/', getQuotes);
router.post('/', createQuote);

module.exports = router;
