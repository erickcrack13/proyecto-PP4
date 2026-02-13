const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    if (event.httpMethod === 'GET') {
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify(data || []) };

    } else if (event.httpMethod === 'POST') {
      const product = JSON.parse(event.body);
      product.id = product.id || ('p' + Date.now());
      product.fecha_creacion = product.fecha_creacion || new Date().toISOString();
      product.ultima_actualizacion = new Date().toISOString();

      const { data, error } = await supabase.from('products').insert(product).select();
      if (error) throw error;
      return { statusCode: 201, headers, body: JSON.stringify(data[0]) };

    } else if (event.httpMethod === 'PUT') {
      const pathParts = event.path.split('/');
      const id = pathParts[pathParts.length - 1];
      const updates = JSON.parse(event.body);
      updates.ultima_actualizacion = new Date().toISOString();

      const { data, error } = await supabase.from('products').update(updates).eq('id', id).select();
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };

    } else if (event.httpMethod === 'DELETE') {
      const pathParts = event.path.split('/');
      const id = pathParts[pathParts.length - 1];

      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
