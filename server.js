const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

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

          return res.status(200).json(data);
        } else {
          // Get all proposals: /api/proposals
          const { data, error } = await supabase
            .from('proposals')
            .select('*')
            .order('createdAt', { ascending: false });

          if (error) {
            return res.status(500).json({ error: error.message });
          }

          return res.status(200).json(data);
        }
      }

      if (req.method === 'POST') {
        // Create new proposal: /api/proposals
        const body = req.body;
        if (!body) {
          return res.status(400).json({ error: 'Request body required' });
        }

        const { data, error } = await supabase
          .from('proposals')
          .insert([body])
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
          query = query.eq('proposalId', proposalId);
        }

        const { data, error } = await query.order('createdAt', { ascending: false });

        if (error) {
          return res.status(500).json({ error: error.message });
        }

        return res.status(200).json(data);
      }

      if (req.method === 'POST') {
        // Create new response: /api/responses
        const body = req.body;
        if (!body) {
          return res.status(400).json({ error: 'Request body required' });
        }

        const { data, error } = await supabase
          .from('responses')
          .insert([body])
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
