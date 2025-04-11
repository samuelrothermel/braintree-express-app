document.addEventListener('DOMContentLoaded', () => {
  // Debugging: Check if elements exist
  console.log('Tax total element:', document.querySelector('#tax-total'));
  console.log('Total amount element:', document.querySelector('#total-amount'));

  const form = document.querySelector('#payment-form');
  const productTotalInput = document.querySelector('#product-total');
  const shippingMethodSelect = document.querySelector('#shipping-method');
  const taxTotalElement = document.querySelector('#tax-total');
  const totalAmountElement = document.querySelector('#total-amount');
  const amountInput = document.querySelector('#amount'); // Hidden input to store the final amount
  const transactionIdElement = document.querySelector('#transaction-id');
  const transactionAmountElement = document.querySelector(
    '#transaction-amount'
  );
  const transactionStatusElement = document.querySelector(
    '#transaction-status'
  );
  const transactionTypeElement = document.querySelector('#transaction-type');
  const cardTypeElement = document.querySelector('#card-type');
  const processorResponseElement = document.querySelector(
    '#processor-response'
  );
  const processorAuthorizationCodeElement = document.querySelector(
    '#processor-authorization-code'
  );
  const merchantNameElement = document.querySelector('#merchant-name');
  const networkTransactionIdElement = document.querySelector(
    '#network-transaction-id'
  );
  const taxRate = 0.1; // 10% tax rate

  // Function to calculate the total amount
  const calculateTotal = () => {
    const productTotal = 20; // Example product total, replace with actual value
    const shippingCost = 0; // Example shipping cost, replace with actual value
    const tax = (productTotal + shippingCost) * taxRate;
    const total = productTotal + shippingCost + tax;

    // Safely update the tax and total placeholders
    if (taxTotalElement) {
      taxTotalElement.textContent = tax.toFixed(2);
      console.log('Updated tax placeholder:', tax.toFixed(2));
    } else {
      console.error('Tax total element not found');
    }

    if (totalAmountElement) {
      totalAmountElement.textContent = total.toFixed(2);
      console.log('Updated total placeholder:', total.toFixed(2));
    } else {
      console.error('Total amount element not found');
    }

    // Update the hidden input for the total amount
    if (amountInput) {
      amountInput.value = total.toFixed(2);
      console.log('Updated hidden amount input:', total.toFixed(2));
    } else {
      console.error('Amount input element not found');
    }
  };

  // Initialize the total amount on page load
  calculateTotal();

  // Fetch the client token from the server
  fetch('/api/payments/client_token')
    .then(response => response.json())
    .then(data => {
      const clientToken = data.clientToken;

      // Initialize the Drop-in UI
      braintree.dropin.create(
        {
          authorization: clientToken,
          container: '#dropin-container',
          paypal: {
            flow: 'checkout',
            requestBillingAgreement: true,
            amount: 21.0,
            currency: 'USD',
            intent: 'sale',
          },
          venmo: {
            allowDesktopWebLogin: true,
          },
          googlePay: {
            googlePayVersion: 2,
            merchantId: 'sandbox', // Replace with your Google Pay merchant ID in Production
            transactionInfo: {
              totalPriceStatus: 'FINAL',
              totalPrice: 21,
              currencyCode: 'USD',
            },
            allowedPaymentMethods: [
              {
                type: 'CARD',
                parameters: {
                  billingAddressRequired: true,
                  billingAddressParameters: {
                    format: 'FULL',
                  },
                },
              },
            ],
          },
        },
        (err, instance) => {
          if (err) {
            console.error('Error initializing Drop-in UI:', err);
            return;
          }

          form.addEventListener('submit', event => {
            event.preventDefault();

            instance
              .requestPaymentMethod()
              .then(payload => {
                // Send the payment method nonce and amount to the server
                fetch('/api/payments/checkout', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    amount: amountInput.value,
                    paymentMethodNonce: payload.nonce,
                  }),
                })
                  .then(response => response.json())
                  .then(data => {
                    if (data.success) {
                      // Update the transaction response sidebar
                      const transaction = data.transaction;
                      transactionIdElement.textContent = `Transaction ID: ${transaction.id}`;
                      transactionAmountElement.textContent = `Amount: $${transaction.amount}`;
                      transactionStatusElement.textContent = `Status: ${transaction.status}`;
                      transactionTypeElement.textContent = `Type: ${transaction.type}`;
                      cardTypeElement.textContent = `Card Type: ${transaction.cardType}`;
                      processorResponseElement.textContent = `Processor Response: ${transaction.processorResponse}`;
                      processorAuthorizationCodeElement.textContent = `Authorization Code: ${transaction.processorAuthorizationCode}`;
                      merchantNameElement.textContent = `Merchant Name: ${transaction.merchantName}`;
                      networkTransactionIdElement.textContent = `Network Transaction ID: ${transaction.networkTransactionId}`;
                    } else {
                      console.error('Transaction failed:', data.error);
                    }
                  })
                  .catch(err => {
                    console.error('Error processing transaction:', err);
                  });
              })
              .catch(requestPaymentMethodErr => {
                // Handle errors when no payment method is available
                console.error(
                  'Error requesting payment method:',
                  requestPaymentMethodErr
                );
                alert(
                  'No payment method is available. Please select a valid payment method.'
                );
              });
          });
        }
      );
    })
    .catch(err => {
      console.error('Failed to fetch client token:', err);
    });
});
