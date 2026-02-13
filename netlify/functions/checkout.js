const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    if (event.httpMethod === 'GET') {
      const { data, error } = await supabase.from('transactions').select('*').order('fecha', { ascending: false });
      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify(data || []) };

    } else if (event.httpMethod === 'POST') {
      const compra = JSON.parse(event.body);
      compra.id = compra.id || ('TXN-' + Math.random().toString(36).slice(2,10).toUpperCase());
      compra.fecha = new Date().toISOString();

      const { data, error } = await supabase.from('transactions').insert(compra).select();
      if (error) throw error;
      return { statusCode: 201, headers, body: JSON.stringify(data[0]) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
