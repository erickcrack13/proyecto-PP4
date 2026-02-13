const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    if (event.httpMethod === 'GET') {
      const { data, error } = await supabase.from('settings').select('rate').single();
      if (error) return { statusCode: 200, headers, body: JSON.stringify({ rate: 216.38 }) };
      return { statusCode: 200, headers, body: JSON.stringify({ rate: data?.rate ?? 216.38 }) };

    } else if (event.httpMethod === 'PUT') {
      const { rate } = JSON.parse(event.body);
      const r = Number(rate);
      if (!isNaN(r) && r > 0) {
        const { error } = await supabase.from('settings').upsert({ id: 1, rate: r });
        if (error) throw error;
        return { statusCode: 200, headers, body: JSON.stringify({ rate: r }) };
      } else {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid rate' }) };
      }
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
