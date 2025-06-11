const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { initDB, insertEvent, getEvents, insertContactMessage, getContactMessages } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize the database
initDB();

// Endpoint to record a new event
app.post('/api/event', (req, res) => {
  const { type, toolName, details } = req.body;
  if (!type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  // Store toolName or details as string for logging
  insertEvent({ type, toolName: toolName || (details ? JSON.stringify(details) : '') });
  res.status(200).json({ status: 'ok' });
});

// Endpoint to get all events
app.get('/api/events', async (req, res) => {
  try {
    const events = await getEvents();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Endpoint to record a contact message and send to HubSpot
app.post('/api/contact-message', async (req, res) => {
  const { name, email, company, phone, budget, message, product } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    await insertContactMessage({ name, email, company, phone, budget, message, product });
    // Log the contact form submission as an event
    await insertEvent({ type: 'contact_form_submit', toolName: product || 'general' });

    // Send to HubSpot (using provided portal ID and new form GUID)
    const hubspotUrl = 'https://api-eu1.hsforms.com/submissions/v3/integration/submit/146178857/1b720be4-7b2e-4593-8002-82a1c330be7f';
    const hubspotPayload = {
      fields: [
        { name: 'email', value: email },
        { name: 'firstname', value: name },
        { name: 'company', value: company },
        { name: 'phone', value: phone },
        { name: 'budget', value: budget },
        { name: 'message', value: message },
        { name: 'product', value: product }
      ],
      context: {
        pageUri: 'http://localhost:3000/contact',
        pageName: 'Contact Us'
      }
    };
    await axios.post(hubspotUrl, hubspotPayload, {
      headers: { 'Content-Type': 'application/json' }
    });

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Error saving or sending contact message:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to save or send contact message' });
  }
});

// Endpoint to get all contact messages
app.get('/api/contact-messages', async (req, res) => {
  try {
    const messages = await getContactMessages();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contact messages' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend API running on port ${PORT}`);
});

module.exports = { initDB, insertEvent, getEvents, insertContactMessage, getContactMessages }; 