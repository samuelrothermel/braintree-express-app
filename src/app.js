const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars'); // Import Handlebars
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

require('dotenv').config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set Handlebars as the view engine
app.engine(
  'hbs',
  exphbs.engine({
    extname: '.hbs', // Use .hbs file extension
    defaultLayout: 'main', // Specify the default layout
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
  })
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/api/payments', paymentRoutes);

// Index route
app.get('/', (req, res) => {
  res.render('index', { title: 'Braintree Payment Gateway' });
});

// Checkout route
app.get('/checkout', (req, res) => {
  res.render('checkout', {
    title: 'Checkout Page',
    paypalClientId: process.env.PAYPAL_CLIENT_ID, // Pass PayPal client ID
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
