# Valentine's Day App Backend

This is a simple JSON Server backend for the Valentine's Day application.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

The server will run on `http://localhost:3001`

## API Endpoints

### Proposals
- `GET /proposals` - Get all proposals
- `GET /proposals/:id` - Get a specific proposal
- `POST /proposals` - Create a new proposal

### Responses
- `GET /responses` - Get all responses
- `GET /responses?proposalId=:id` - Get responses for a specific proposal
- `POST /responses` - Create a new response

## Database

The database is stored in `db.json` and automatically updates when you make changes through the API.
