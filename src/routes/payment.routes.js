const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

router.post('/create_payment_url', paymentController.createPaymentUrl);

module.exports = router;