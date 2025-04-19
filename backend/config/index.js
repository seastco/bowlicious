require('dotenv').config();
module.exports = {
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    from: process.env.TWILIO_PHONE_NUMBER,
  },
  replyMessage: process.env.REPLY_MESSAGE,
  stripeKey: process.env.STRIPE_SECRET_KEY,
  mongoURI: process.env.MONGODB_URI,
  clientURL: process.env.CLIENT_URL,
};