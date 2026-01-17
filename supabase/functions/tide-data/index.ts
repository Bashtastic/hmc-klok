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
    console.log('Fetching tide data from waterberichtgeving.rws.nl');
    
    const response = await fetch('https://waterberichtgeving.rws.nl/dynamisch/hmc-api/getij.json');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tide data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Tide data fetched successfully');
    
    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error: unknown) {
    console.error('Error fetching tide data:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
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
