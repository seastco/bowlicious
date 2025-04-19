const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const { twilio: twConfig, replyMessage } = require('../config');
const Message = require('../models/Message');
const client = twilio(twConfig.accountSid, twConfig.authToken);

// Send initial SMS after successful payment
router.post('/send', async (req, res) => {
  const { phone } = req.body;
  try {
    let msgDoc = await Message.findOne({ phone });
    if (!msgDoc) {
      const marketingText = 'CHIPOTLE: Reply with "BOWLICIOUS" for a free meal code! Deal lasts through Friday!';
      await client.messages.create({
        to: phone,
        from: twConfig.from,
        body: marketingText
      });
      msgDoc = new Message({ phone, exchanged: [{ from: 'Bowlicious', text: marketingText, timestamp: new Date() }] });
      await msgDoc.save();
    }
    res.json({ success: true, exchanged: msgDoc.exchanged });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Retrieve conversation
router.get('/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    const msg = await Message.findOne({ phone });
    if (!msg) return res.json({ exists: false });
    const userReply = msg.exchanged.find(m => m.from === phone && m.text.trim().toLowerCase() === 'bowlicious');
    const botReply = msg.exchanged.find(m => m.from === 'Bowlicious' && m.text === replyMessage);
    res.json({ exists: true, exchanged: msg.exchanged, botReply: botReply?.text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Webhook to receive incoming SMS replies
router.post('/webhook', express.urlencoded({ extended: false }), async (req, res) => {
  const incomingFrom = req.body.From;
  const incomingBody = req.body.Body;
  try {
    let msgDoc = await Message.findOne({ phone: incomingFrom });
    if (!msgDoc) return res.sendStatus(200);
    msgDoc.exchanged.push({ from: incomingFrom, text: incomingBody, timestamp: new Date() });
    if (incomingBody.trim().toUpperCase() === 'BOWLICIOUS') {
      await client.messages.create({ to: incomingFrom, from: twConfig.from, body: replyMessage });
      msgDoc.exchanged.push({ from: 'Bowlicious', text: replyMessage, timestamp: new Date() });
    }
    await msgDoc.save();
    res.send('<Response></Response>');
  } catch (err) {
    console.error(err);
    res.send('<Response></Response>');
  }
});

module.exports = router;