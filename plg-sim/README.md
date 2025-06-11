# PLG Motion Simulation App

A local simulation environment for testing Product-Led Growth (PLG) motion tracking and analytics. This application simulates a tool directory with user interactions that can be tracked and analyzed.

## Features

- Display of RevOps tools with categories and descriptions
- Simulated user interactions (signup, demo requests)
- Event tracking and storage
- Real-time event logging
- Dockerized development environment

## Prerequisites

- Docker
- Docker Compose
- Node.js 18+ (for local development)

## Getting Started

1. Clone the repository
2. Navigate to the project directory
3. Start the application:

```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## API Endpoints

### POST /api/event
Record a new user interaction event.

Request body:
```json
{
  "type": "signup_click",
  "toolName": "SalesForce CRM"
}
```

### GET /api/events
Retrieve all recorded events.

## Development

The application is structured as follows:

```
plg-sim/
├── backend/          # Express API server
├── frontend/         # React application
└── docker-compose.yml
```

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

## Event Types

The application tracks the following event types:
- `signup_click`: User clicks on signup button
- `demo_click`: User requests a demo
- `tool_page_view`: User views a tool's detail page

## License

MIT 