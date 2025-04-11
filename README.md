# Braintree Express App

This project is a Node.js application using Express that integrates with Braintree's payment processing SDK. It provides endpoints for creating transactions and generating client tokens.

## Project Structure

```
braintree-express-app
├── src
│   ├── app.js                # Entry point of the application
│   ├── routes
│   │   └── paymentRoutes.js  # Handles payment-related routes
│   └── config
│       └── braintree.js      # Configures Braintree SDK
├── package.json              # NPM configuration file
├── .env                      # Environment variables for Braintree credentials
└── README.md                 # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone https://github.com/yourusername/braintree-express-app.git
   cd braintree-express-app
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add your Braintree credentials:
   ```
   BRAINTRREE_MERCHANT_ID=your_merchant_id
   BRAINTRREE_PUBLIC_KEY=your_public_key
   BRAINTRREE_PRIVATE_KEY=your_private_key
   ```

4. **Run the application:**
   ```
   npm start
   ```

## Usage

- **Generate a client token:**
  Send a GET request to `/api/payment/token`.

- **Create a transaction:**
  Send a POST request to `/api/payment/checkout` with the transaction details in the request body.

## License

This project is licensed under the MIT License.