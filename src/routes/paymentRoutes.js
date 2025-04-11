const express = require('express');
const router = express.Router();
const braintree = require('../config/braintree');

// Route to generate a client token
router.get('/client_token', async (req, res) => {
  try {
    const response = await braintree.clientToken.generate({});
    res.json({ clientToken: response.clientToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to create a transaction
router.post('/checkout', async (req, res) => {
  const { amount, paymentMethodNonce } = req.body;

  try {
    const result = await braintree.transaction.sale({
      amount,
      paymentMethodNonce,
      options: {
        submitForSettlement: true,
      },
    });

    if (result.success) {
      const transaction = result.transaction;
      res.json({
        success: true,
        transaction: {
          id: transaction.id,
          status: transaction.status,
          type: transaction.type,
          amount: transaction.amount,
          cardType: transaction.creditCard.cardType,
          processorResponse: transaction.processorResponseText,
          processorAuthorizationCode: transaction.processorAuthorizationCode,
          merchantName: transaction.paymentReceipt?.merchantName || 'N/A',
          merchantAddress: transaction.paymentReceipt?.merchantAddress || {},
          networkTransactionId: transaction.networkTransactionId || 'N/A',
        },
      });
    } else {
      res.status(500).json({ success: false, error: result.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to render the success page
router.get('/success', (req, res) => {
  const { transactionId, amount } = req.query;
  res.render('success', { title: 'Payment Success', transactionId, amount });
});

module.exports = router;
