import React, { useState } from 'react';
import { api } from '../api';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

export default function PhoneForm({ setPhone, data, setData }) {
  const [input, setInput] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setPhone(input);
    const res = await api.get(`/sms/${input}`);
    if (res.data.exists) setData(res.data);
    else {
      const stripe = await stripePromise;
      const session = await api.post('/payment/create-checkout-session', { phone: input });
      stripe.redirectToCheckout({ sessionId: session.data.id });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <input
        type="text"
        className="input-field"
        placeholder="Enter phone number"
        value={input}
        onChange={e => setInput(e.target.value)}
        required
      />
      <button type="submit" className="submit-button">Go</button>
    </form>
  );
}