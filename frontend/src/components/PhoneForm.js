import React, { useState } from 'react';
import { api } from '../api';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

export default function PhoneForm({ setPhone, data, setData }) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validatePhone = (phone) => {
    // Simple validation for US phone numbers
    const regex = /^\d{10}$|^\d{3}-\d{3}-\d{4}$|^\(\d{3}\)\s?\d{3}-\d{4}$/;
    return regex.test(phone);
  };

  const formatPhone = (phone) => {
    // Remove all non-digit characters
    return phone.replace(/\D/g, '');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    const formattedPhone = formatPhone(input);
    
    if (!validatePhone(formattedPhone)) {
      setError('Please enter a valid 10-digit US phone number');
      return;
    }

    setIsLoading(true);
    try {
      setPhone(formattedPhone);
      const res = await api.get(`/sms/${formattedPhone}`);
      
      if (res.data.exists) {
        setData(res.data);
      } else {
        const stripe = await stripePromise;
        const session = await api.post('/payment/create-checkout-session', { phone: formattedPhone });
        stripe.redirectToCheckout({ sessionId: session.data.id });
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="phone-form-container">
      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="tel"
          className="input-field"
          placeholder="Enter phone number"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={isLoading}
          required
        />
        <button 
          type="submit" 
          className="submit-button"
          disabled={isLoading}
        >
          {isLoading ? '...' : 'Go'}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
      {data?.exists && (
        <div className="success-message">
          Conversation found
        </div>
      )}
    </div>
  );
}