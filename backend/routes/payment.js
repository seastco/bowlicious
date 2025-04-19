const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(require('../config').stripeKey);

router.post('/create-checkout-session', async (req, res) => {
  const { phone } = req.body;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: 'Bowlicious SMS' },
        unit_amount: 100,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${require('../config').clientURL}/?phone=${encodeURIComponent(phone)}&paid=true`,
    cancel_url: `${require('../config').clientURL}/?phone=${encodeURIComponent(phone)}&paid=false`,
    metadata: { phone },
  });
  res.json({ id: session.id });
});

module.exports = router;