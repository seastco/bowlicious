const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { mongoURI } = require('./config');

// Import routers, support either direct or {router} export
let smsRoutesModule = require('./routes/sms');
const smsRoutes = smsRoutesModule.router || smsRoutesModule;
let paymentModule = require('./routes/payment');
const paymentRoutes = paymentModule.router || paymentModule;

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(mongoURI).then(() => console.log('MongoDB connected'));

// Mount route routers
app.use('/api/sms', smsRoutes);
app.use('/api/payment', paymentRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));