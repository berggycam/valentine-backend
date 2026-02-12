const { createClient } = require('@supabase/supabase-js');

// Supabase configuration (hardcoded as requested)
const supabaseUrl = 'https://wcpysmnwsovhznvcxyyz.supabase.co';
const supabaseKey = 'sb_publishable_8Vr6irzDMBXmPDMkIHkT1g_D9wUBwpR';

const supabase = createClient(supabaseUrl, supabaseKey);

// Simple Express-like server setup for Vercel
const handler = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Parse JSON body for POST/PUT requests
  let body = null;
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    try {
      body = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => {
          data += chunk;
        });
        req.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
        req.on('error', reject);
      });
    } catch (error) {
      return res.status(400).json({ error: 'Invalid JSON in request body' });
    }
  }

  // Root endpoint
  if (req.url === '/' && req.method === 'GET') {
    return res.status(200).json({
      message: 'Welcome to the Valentine\'s Day App API',
      endpoints: {
        'GET /proposals': 'Get all proposals',
        'GET /proposals/:id': 'Get a specific proposal by ID',
        'POST /proposals': 'Create a new proposal',
        'GET /proposals/:id/responses': 'Get responses for a specific proposal',
        'POST /proposals/:id/responses': 'Add a response to a proposal'
      },
      status: 'online',
      timestamp: new Date().toISOString()
    });
  }

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  const pathParts = pathname.split('/').filter(Boolean);

  try {
    // Health check endpoint
    if (pathname === '/api' && req.method === 'GET') {
      return res.status(200).json({
        message: 'Valentine Backend with Supabase is running! ❤️',
        status: 'healthy',
        endpoints: {
          proposals: '/api/proposals',
          responses: '/api/responses',
          health: '/api'
        }
      });
    }

    // Proposals endpoints
    if (pathParts[0] === 'api' && pathParts[1] === 'proposals') {
      // Handle /api/proposals/{id}/responses first
      if (pathParts[2] && pathParts[3] === 'responses') {
        if (req.method === 'GET') {
          // Get responses for a specific proposal
          const { data, error } = await supabase
            .from('responses')
            .select('*')
            .eq('proposalid', pathParts[2])
            .order('createdat', { ascending: false });
          
          if (error) {
            return res.status(500).json({ error: error.message });
          }
          
          // Transform lowercase columns to camelCase
          const transformed = data.map(item => ({
            id: item.id,
            proposalId: item.proposalid,
            message: item.message,
            fromName: item.fromname,
            emotions: item.emotions,
            createdAt: item.createdat
          }));
          
          return res.status(200).json(transformed);
        }
        
        if (req.method === 'POST') {
          // Add a response to a proposal
          if (!body) {
            return res.status(400).json({ error: 'Request body required' });
          }
          
          const { data, error } = await supabase
            .from('responses')
            .insert([{
              proposalid: pathParts[2],
              message: body.message,
              fromname: body.fromName,
              emotions: body.emotions
            }])
            .select()
            .single();
          
          if (error) {
            return res.status(500).json({ error: error.message });
          }
          
          return res.status(201).json(data);
        }
      }
      
      if (req.method === 'GET') {
        if (pathParts[2]) {
          // Get specific proposal: /api/proposals/{id}
          const { data, error } = await supabase
            .from('proposals')
            .select('*')
            .eq('id', pathParts[2])
            .single();

          if (error) {
            return res.status(404).json({ error: 'Proposal not found' });
          }

          // Transform lowercase columns to camelCase
          if (data) {
            const transformed = {
              id: data.id,
              fromName: data.fromname,
              toName: data.toname,
              message: data.message,
              emotions: data.emotions,
              fromEmail: data.fromemail,
              toEmail: data.toemail,
              createdAt: data.createdat
            };
            return res.status(200).json(transformed);
          }

          return res.status(200).json(data);
        } else {
          // Get all proposals: /api/proposals
          const { data, error } = await supabase
            .from('proposals')
            .select('*')
            .order('createdat', { ascending: false });

          if (error) {
            return res.status(500).json({ error: error.message });
          }

          // Transform lowercase columns to camelCase
          const transformed = data.map(item => ({
            id: item.id,
            fromName: item.fromname,
            toName: item.toname,
            message: item.message,
            emotions: item.emotions,
            fromEmail: item.fromemail,
            toEmail: item.toemail,
            createdAt: item.createdat
          }));

          return res.status(200).json(transformed);
        }
      }

      if (req.method === 'POST') {
        // Create new proposal: /api/proposals
        if (!body) {
          return res.status(400).json({ error: 'Request body required' });
        }

        // Generate an ID if not provided
        if (!body.id) {
          body.id = Math.random().toString(36).substring(2, 15);
        }

        const { data, error } = await supabase
          .from('proposals')
          .insert([{
            id: body.id,
            fromname: body.fromName,
            toname: body.toName,
            message: body.message,
            emotions: body.emotions,
            fromemail: body.fromEmail,
            toemail: body.toEmail
          }])
          .select()
          .single();

        if (error) {
          return res.status(500).json({ error: error.message });
        }

        return res.status(201).json(data);
      }
    }

    // Responses endpoints
    if (pathParts[0] === 'api' && pathParts[1] === 'responses') {
      if (req.method === 'GET') {
        // Get responses, optionally filtered by proposalId
        let query = supabase.from('responses').select('*');

        const url = new URL(req.url, `http://${req.headers.host}`);
        const proposalId = url.searchParams.get('proposalId');

        if (proposalId) {
          query = query.eq('proposalid', proposalId);
        }

        const { data, error } = await query.order('createdat', { ascending: false });

        if (error) {
          return res.status(500).json({ error: error.message });
        }

        // Transform lowercase columns to camelCase
        const transformed = data.map(item => ({
          id: item.id,
          proposalId: item.proposalid,
          message: item.message,
          fromName: item.fromname,
          emotions: item.emotions,
          createdAt: item.createdat
        }));

        return res.status(200).json(transformed);
      }

      if (req.method === 'POST') {
        // Create new response: /api/responses
        if (!body) {
          return res.status(400).json({ error: 'Request body required' });
        }

        const { data, error } = await supabase
          .from('responses')
          .insert([{
            id: body.id,
            proposalid: body.proposalId,
            message: body.message,
            fromname: body.fromName,
            emotions: body.emotions
          }])
          .select()
          .single();

        if (error) {
          return res.status(500).json({ error: error.message });
        }

        return res.status(201).json(data);
      }
    }

    // 404 for unknown routes
    return res.status(404).json({ error: 'Endpoint not found' });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = handler;
