# PLG Simulator

A Streamlit application to simulate user interactions with your website and send data to HubSpot.

## Features

- Event tracking simulation
- Contact form submission simulation
- Batch contact form submissions
- JSON-based configuration for both events and contacts

## Setup

1. Install the required dependencies:
```bash
pip install -r requirements.txt
```

2. Make sure your backend server is running on port 3001 (or update the `BACKEND_URL` in `app.py`)

3. Run the Streamlit app:
```bash
streamlit run app.py
```

## Usage

### Event Tracking

1. Select "Event Tracking" from the sidebar
2. Choose an event type from the dropdown
3. Optionally enter a tool name
4. Enter event details as JSON
5. Click "Send Event" to simulate the event

Example event JSON:
```json
{
    "key": "value",
    "timestamp": "2024-03-20T12:00:00Z",
    "metadata": {
        "source": "simulator",
        "version": "1.0"
    }
}
```

### Contact Form

1. Select "Contact Form" from the sidebar
2. Fill in the individual contact form fields
3. Click "Send Single Contact" to submit a single contact

For batch submissions:
1. Enter multiple contacts as a JSON array
2. Click "Send Batch Contacts" to submit multiple contacts

Example batch JSON:
```json
[
    {
        "name": "John Doe",
        "email": "john@example.com",
        "company": "Acme Inc",
        "phone": "+1234567890",
        "budget": "10000-50000",
        "message": "Interested in your product",
        "product": "Enterprise"
    },
    {
        "name": "Jane Smith",
        "email": "jane@example.com",
        "company": "XYZ Corp",
        "phone": "+0987654321",
        "budget": "50000+",
        "message": "Looking for a demo",
        "product": "Professional"
    }
]
```

## Notes

- The simulator adds a 0.5-second delay between batch submissions to prevent overwhelming the server
- All submissions are sent to both your backend and HubSpot (if configured)
- Make sure your backend server is running before using the simulator 