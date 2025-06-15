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
    // First, mark as marketing contact BEFORE form submission
    try {
      const marketingContactUrl = 'https://api.hubapi.com/crm/v3/marketing-contacts/convert';
      const marketingContactPayload = {
        emailAddresses: [email]
      };
      
      console.log('Converting to marketing contact:', marketingContactPayload);
      const marketingContactResponse = await axios.post(marketingContactUrl, marketingContactPayload, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.HUBSPOT_API_KEY}`
        }
      });
      console.log('Marketing contact conversion response:', marketingContactResponse.data);

      // Wait a moment to ensure the marketing contact status is updated
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (marketingContactError) {
      console.error('Error converting to marketing contact:', marketingContactError.response?.data || marketingContactError.message);
      // Continue with form submission even if marketing conversion fails
    }

    // Now proceed with form submission
    await insertContactMessage({ name, email, company, phone, budget, message, product });
    // Log the contact form submission as an event
    await insertEvent({ type: 'contact_form_submit', toolName: product || 'general' });

    // Send to HubSpot form
    const hubspotFormUrl = process.env.HUBSPOT_FORM_URL;
    if (!hubspotFormUrl) {
      throw new Error('HUBSPOT_FORM_URL environment variable is not set');
    }
    const hubspotFormPayload = {
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

    // Send to HubSpot marketing contacts
    const hubspotMarketingUrl = 'https://api-eu1.hubapi.com/communication-preferences/v3/subscribe';
    
    // First, get the subscription ID for marketing
    const subscriptionTypesUrl = 'https://api-eu1.hubapi.com/communication-preferences/v3/definitions';
    const subscriptionTypesResponse = await axios.get(subscriptionTypesUrl, {
      headers: { 
        'Authorization': `Bearer ${process.env.HUBSPOT_API_KEY}`
      }
    });
    
    const availableSubscriptions = subscriptionTypesResponse.data.subscriptionDefinitions;
    console.log('Available subscription types:', availableSubscriptions.map(s => s.name));
    
    // Find the marketing subscription ID
    const marketingSubscription = availableSubscriptions.find(
      sub => sub.name === 'Marketing Information'
    );
    
    if (!marketingSubscription) {
      const availableTypes = availableSubscriptions.map(s => s.name).join(', ');
      console.error('Available subscription types:', availableTypes);
      throw new Error(`Could not find Marketing Information subscription type. Available types: ${availableTypes}`);
    }

    console.log('Found marketing subscription:', marketingSubscription);

    const hubspotMarketingPayload = {
      emailAddress: email,
      subscriptionId: marketingSubscription.id,
      legalBasis: "LEGITIMATE_INTEREST_PQL",
      legalBasisExplanation: "User submitted contact form"
    };

    try {
      // Send to HubSpot form
      console.log('Sending to HubSpot form URL:', hubspotFormUrl);
      console.log('Form payload:', JSON.stringify(hubspotFormPayload, null, 2));
      
      const formResponse = await axios.post(hubspotFormUrl, hubspotFormPayload, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('HubSpot form response:', formResponse.data);

      // Then, send to HubSpot marketing
      if (!process.env.HUBSPOT_API_KEY) {
        throw new Error('HUBSPOT_API_KEY is not set');
      }

      console.log('Sending to HubSpot marketing URL:', hubspotMarketingUrl);
      console.log('Marketing payload:', JSON.stringify(hubspotMarketingPayload, null, 2));
      
      const marketingResponse = await axios.post(hubspotMarketingUrl, hubspotMarketingPayload, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.HUBSPOT_API_KEY}`
        }
      });
      console.log('HubSpot marketing response:', marketingResponse.data);

      res.status(200).json({ status: 'ok' });
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
        headers: error.config?.headers ? {
          ...error.config.headers,
          'Authorization': error.config.headers.Authorization ? 'Bearer [REDACTED]' : undefined
        } : undefined
      });
      throw error;
    }
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