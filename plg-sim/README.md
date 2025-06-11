# PLG Motion Simulation App

A comprehensive simulation environment for testing Product-Led Growth (PLG) motion tracking and analytics. This application simulates user interactions with a product showcase website, including event tracking, form submissions, and analytics.

## Features

### Frontend Application
- Modern React-based user interface
- Product showcase with detailed descriptions
- Interactive navigation and user flows
- Contact form integration with HubSpot
- Real-time event tracking
- Responsive design for all devices

### Backend API
- Express.js server for handling requests
- SQLite database for data persistence
- Event tracking and storage
- Contact form submission handling
- HubSpot integration
- CORS support for development

### Streamlit Simulator
- Interactive simulation of user events
- Batch event submission capability
- Contact form simulation
- Predefined event types and form fields
- Real-time feedback on submissions
- JSON-based configuration for both events and contacts

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.8+ (for Streamlit simulator)

## Getting Started

1. Clone the repository
2. Navigate to the project directory
3. Start all services:

```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Streamlit Simulator: http://localhost:8501

## API Endpoints

### Event Tracking

#### POST /api/event
Record a new user interaction event.

Request body:
```json
{
  "type": "page_view",
  "toolName": "Product One",
  "details": {
    "page": "home",
    "timestamp": "2024-03-20T12:00:00Z"
  }
}
```

#### GET /api/events
Retrieve all recorded events.

### Contact Form

#### POST /api/contact-message
Submit a contact form message to HubSpot.

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Acme Inc",
  "phone": "+1234567890",
  "budget": "> $10,000",
  "message": "Interested in your product",
  "product": "Product One"
}
```

#### GET /api/contact-messages
Retrieve all submitted contact messages.

## Streamlit Simulator

The Streamlit simulator provides an interface for testing and simulating user interactions with the application.

### Event Tracking Simulation

#### Single Event Submission
- Select from predefined event types
- Add optional tool name
- Include detailed JSON payload
- Real-time submission feedback

#### Batch Event Submission
- Submit multiple events via JSON array
- Validate event types
- Automatic error handling
- Success rate tracking

Example batch event JSON:
```json
[
    {
        "type": "page_view",
        "toolName": "Product One",
        "details": {
            "page": "home",
            "timestamp": "2024-03-20T12:00:00Z"
        }
    }
]
```

### Contact Form Simulation

#### Single Contact Submission
- Fill in contact details
- Select product and budget range
- Submit individual contact forms
- Real-time submission feedback

#### Batch Contact Submission
- Submit multiple contacts via JSON array
- Validate product and budget values
- Automatic error handling
- Success rate tracking

Example batch contact JSON:
```json
[
    {
        "name": "John Doe",
        "email": "john@example.com",
        "company": "Acme Inc",
        "phone": "+1234567890",
        "budget": "> $10,000",
        "message": "Interested in your product",
        "product": "Product One"
    }
]
```

## Event Types

The application tracks the following event types:
- `page_view`: User views a page
- `tool_usage`: User interacts with a tool
- `contact_form_submit`: User submits a contact form
- `nav_click`: User clicks navigation elements
- `learn_more_click`: User clicks learn more button
- `contact_us_click`: User clicks contact button
- `back_to_home_click`: User returns to home page
- `back_to_homepage_click`: User returns to homepage
- `chat_with_us_click`: User initiates chat
- `custom`: Custom event type

## Project Structure

```
plg-sim/
├── backend/              # Express API server
│   ├── index.js         # Main server file
│   ├── db.js           # Database operations
│   └── Dockerfile      # Backend container config
├── frontend/            # React application
│   ├── src/            # Source code
│   └── Dockerfile      # Frontend container config
├── streamlit-simulator/ # Streamlit simulation tool
│   ├── app.py          # Main simulator file
│   └── requirements.txt # Python dependencies
└── docker-compose.yml   # Service orchestration
```

## Development

### Local Development

1. Backend:
```bash
cd backend
npm install
npm start
```

2. Frontend:
```bash
cd frontend
npm install
npm start
```

3. Streamlit Simulator:
```bash
cd streamlit-simulator
pip install -r requirements.txt
streamlit run app.py
```

## License

MIT 