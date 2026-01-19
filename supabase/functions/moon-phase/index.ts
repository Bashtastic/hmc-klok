const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching moon phase data from waterberichtgeving.rws.nl');
    
    const response = await fetch('https://waterberichtgeving.rws.nl/dynamisch/hmc-api/maanfase.json');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch moon data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Moon phase data fetched successfully');
    
    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Error fetching moon phase data:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});
