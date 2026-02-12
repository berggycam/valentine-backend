const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
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
