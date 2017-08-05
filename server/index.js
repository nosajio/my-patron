require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

// Load the Stripe credentials from the .env file located in the root dir, then 
// initialise stripe lib with secret key
const { STRIPE_SECRET } = process.env;
const stripe = require('stripe')(STRIPE_SECRET);

// Setup the Express app...
const app = express();
// Tell express how to handle url encoded formdata
app.use( bodyParser.urlencoded({ extended: false }) );
// Tell express where to look for static files
const viewsDir = path.resolve(__dirname, '../views');

app.use( express.static(viewsDir) );

app.get('/', (req, res) => {
  res.sendFile('/index.html');
});

app.get('/thanks', (req, res) => {
  res.sendFile('/thanks.html');
});

// Handle the callback after a successful subscription has been fulfilled
app.post('/subscriber', (req, res) => {
  const { stripeEmail, stripeToken, stripePlan } = req.body;
  const customer = stripe.customers.create({
    email: stripeEmail,
    source: stripeToken,
    plan: stripePlan
  });
  res.redirect('/thanks');
});

const port = process.env.PORT || 9011;
app.listen(port, () => console.log('http://127.0.0.1:%s', port));
