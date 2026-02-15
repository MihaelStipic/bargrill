const { schedule } = require('@netlify/functions');

const handler = async () => {
  try {
    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/rpc/ping`,
      {
        method: 'POST',
        headers: {
          'apikey': process.env.SUPABASE_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Supabase ping:', response.status);
    return { statusCode: 200 };
  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500 };
  }
};

exports.handler = schedule('0 0 */5 * *', handler);