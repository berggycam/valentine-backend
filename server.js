const jsonServer = require('json-server');
const path = require('path');
const fs = require('fs');

const server = jsonServer.create();

// Check if we're in a serverless environment (Vercel)
const isServerless = process.env.VERCEL === '1';

// Use in-memory database for serverless, file-based for local development
let router;
if (isServerless) {
  // In-memory database for serverless
  const initialData = {
    proposals: [
      {
        "id": "7013",
        "fromName": "David",
        "toName": "jessica",
        "message": "How we met: in school\n\nWhat I love about you: their voice\n\nHow you make me feel: i feel great\n\nMy Valentine's message: i miss you",
        "emotions": [
          "Love",
          "Happiness",
          "Passion"
        ]
      },
      {
        "id": "6f60",
        "fromName": "dave",
        "toName": "yh",
        "message": "How we met: nothing\n\nWhat I love about you: yh\n\nHow you make me feel: yh\n\n\nMy Valentine's message: yh",
        "emotions": [
          "Hope"
        ]
      },
      {
        "id": "3a20",
        "fromName": "Test",
        "toName": "Test2",
        "fromEmail": "test@test.com",
        "message": "Test message"
      },
      {
        "id": "34a3",
        "fromName": "yh",
        "toName": "yh",
        "fromEmail": "bergsjoseph@gmail.com",
        "toEmail": "",
        "message": "yh",
        "emotions": [
          "Excitement"
        ],
        "createdAt": "2026-02-12T12:30:55.090Z"
      },
      {
        "id": "29e5",
        "fromName": "yh",
        "toName": "yh",
        "fromEmail": "yh@gmail.com",
        "toEmail": "",
        "message": "yh",
        "emotions": [
          "Excitement"
        ],
        "createdAt": "2026-02-12T12:32:29.816Z"
      },
      {
        "id": "4596",
        "fromName": "yh",
        "toName": "yh",
        "fromEmail": "y67@gmail.com",
        "toEmail": "",
        "message": "yh",
        "emotions": [
          "Nervousness"
        ],
        "createdAt": "2026-02-12T12:36:11.699Z"
      },
      {
        "id": "3c5f",
        "fromName": "yh",
        "toName": "yh",
        "fromEmail": "yh0@gmail.com",
        "toEmail": "",
        "message": "ok sure",
        "emotions": [
          "Nervousness"
        ],
        "createdAt": "2026-02-12T13:07:14.995Z"
      }
    ],
    responses: []
  };
  router = jsonServer.router(initialData);
} else {
  // File-based database for local development
  router = jsonServer.router(path.join(__dirname, 'db.json'));
}

const middlewares = jsonServer.defaults();

// Custom middleware to handle CORS and other headers
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Health check endpoint
server.get('/api', (req, res) => {
  res.json({ 
    message: 'Valentine Backend is running! ❤️',
    status: 'healthy',
    endpoints: {
      proposals: '/api/proposals',
      responses: '/api/responses',
      health: '/api'
    }
  });
});

// Use default middlewares
server.use(middlewares);

// Add custom routes before JSON Server router
server.get('/api/proposals/:id/responses', (req, res) => {
  const proposalId = req.params.id;
  const db = router.db;
  const responses = db.get('responses').filter({ proposalId }).value();
  res.json(responses);
});

// Use default router with /api prefix
server.use('/api', router);

// Create a request handler for Vercel serverless functions
const handler = (req, res) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Let json-server handle the request
  return server(req, res);
};

// Export the handler for Vercel
module.exports = handler;

// Only start the server if not in a serverless environment
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 3001;
  server.listen(PORT, () => {
    console.log(`JSON Server is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api`);
  });
}
