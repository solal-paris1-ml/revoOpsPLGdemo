# 🚀 PLG Motion Simulation App

A comprehensive simulation environment for testing Product-Led Growth (PLG) motion tracking and analytics. This application simulates user interactions with a product showcase website, including event tracking, form submissions, and analytics.

## ⚡ Quick Start (Recommended)

1. **Clone the repository**

2. **Create a `.env` file** in the `backend` directory with the following variables:
```bash
HUBSPOT_FORM_URL=your_hubspot_form_url
HUBSPOT_API_KEY=your_hubspot_api_key
PORT=3001
```

3. **Start all services** using Docker:
```bash
docker-compose up --build
```

This will start the following services:
- 🌐 **Frontend**: http://localhost:3000  
- 🔌 **Backend API**: http://localhost:3001
- events : http://localhost:3001/api/event
- contact-message : http://localhost:3001/api/contact-message
- 📊 **Streamlit Simulator**: http://localhost:8501  

> 🔒 **Important Note:**  
> The SQLite database used by the backend is stored **locally on your machine** and is **not exposed externally**. All event and contact data remains fully private and accessible only within your local environment. This setup is ideal for secure testing and development.

## 📁 Project Structure
```
.
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

### Quick Links
- [Features](#-features)
- [Event Types](#-event-types)
- [Configuration](#-configuration)
- [Development Options](#-development-options)
- [Live Monitoring](#-live-monitoring)
- [API Endpoints](#-api-endpoints)

### Quick API Reference

<details>
<summary>Click to expand API reference</summary>

#### Event Tracking
```bash
# Record a new event
curl -X POST http://localhost:3001/api/event   -H "Content-Type: application/json"   -d '{
    "type": "page_view",
    "toolName": "Product One",
    "details": {
      "page": "home",
      "timestamp": "2024-03-20T12:00:00Z"
    }
  }'

# Get all events
curl http://localhost:3001/api/events
```

#### Contact Form
```bash
# Submit a contact form
curl -X POST http://localhost:3001/api/contact-message   -H "Content-Type: application/json"   -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Acme Inc",
    "phone": "+1234567890",
    "budget": "> $10,000",
    "message": "Interested in your product",
    "product": "Product One"
  }'

# Get all contact messages
curl http://localhost:3001/api/contact-messages
```
</details>

## ✨ Features

<details>
<summary>Click to expand features</summary>

### 🎨 Frontend Application
- Modern React-based user interface
- Product showcase with detailed descriptions
- Interactive navigation and user flows
- Contact form integration with HubSpot
- Real-time event tracking
- Responsive design for all devices

### ⚙️ Backend API
- Express.js server for handling requests
- SQLite database for data persistence
- Event tracking and storage
- Contact form submission handling
- HubSpot integration
- CORS support for development

### 🎮 Streamlit Simulator
- Interactive simulation of user events
- Batch event submission capability
- Contact form simulation
- Predefined event types and form fields
- Real-time feedback on submissions
- JSON-based configuration for both events and contacts
</details>

## 📋 Event Types

<details>
<summary>Click to expand event types</summary>

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
</details>

## 🔐 Configuration

<details>
<summary>Click to expand configuration details</summary>

### Environment Variables
The application requires the following environment variables to be set:

1. `HUBSPOT_FORM_URL`: Your HubSpot form submission URL  
   - Get this from your HubSpot form settings  
   - Format: `https://api.hsforms.com/submissions/v3/integration/submit/{portalId}/{formId}`

2. `HUBSPOT_API_KEY`: Your HubSpot API key  
   - Generate this from your HubSpot account settings  
   - Required for marketing subscription management

3. `PORT`: (Optional) The port for the backend API  
   - Default: 3001

### Customizing Form Fields
The contact form fields can be customized by modifying the `hubspotFormPayload` in `backend/index.js`. The current implementation includes:
- email
- firstname
- company
- phone
- budget
- message
- product

To add or modify fields, update the `fields` array in the payload to match your HubSpot form configuration.
</details>

## 💻 Development Options

<details>
<summary>Click to expand development options</summary>

### 🐳 Option 1: Docker (Recommended)
All dependencies are included in the Docker containers. Simply run:
```bash
docker-compose up --build
```

### 🔧 Option 2: Local Development
If you prefer to run services locally (not recommended for most users):

Prerequisites:
- Node.js 18+
- Python 3.8+
- npm

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
</details>

## 📡 Live Monitoring

<details>
<summary>Click to expand monitoring details</summary>

### 📊 Events Monitoring
- **URL**: `http://localhost:3001/api/events`
- **Method**: GET
- **Example Response**:
```json
[
  {
    "id": 1,
    "type": "button_click",
    "toolName": "pricing_calculator",
    "timestamp": "2024-03-14T10:30:00Z"
  }
]
```

### 📝 Contact Messages Monitoring
- **URL**: `http://localhost:3001/api/contact-messages`
- **Method**: GET
- **Example Response**:
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Acme Inc",
    "phone": "+1234567890",
    "budget": "10000-50000",
    "message": "Interested in your product",
    "product": "enterprise",
    "timestamp": "2024-03-14T10:30:00Z"
  }
]
```
</details>

## 🔌 API Endpoints

<details>
<summary>Click to expand API documentation</summary>

### 📊 Event Tracking

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

### 📝 Contact Form

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
</details>

> 💡 **Note**: The local development option is provided for developers who need to modify the code. For most users, the Docker setup is recommended as it ensures consistent environments and includes all necessary dependencies.
