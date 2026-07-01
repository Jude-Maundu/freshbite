const express = require('express');
const { getPayments, createPayment } = require('../controllers/paymentController');
const requireAdminAuth = require('../middleware/requireAdminAuth');

const router = express.Router();

router.post('/', createPayment);
router.get('/', requireAdminAuth, getPayments);

module.exports = router;
