import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Discovering trending topics...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are TrésorAI, a digital product trend analyst specializing in products for women aged 25-45. 
            Focus on: digital side hustles, manifestation, productivity, self-development, and small business tools.
            Return ONLY valid JSON with no markdown formatting.`
          },
          {
            role: 'user',
            content: `Discover 3 trending topics that would make excellent digital products for my Stan Store audience (women 25-45).
            
            For each trend, provide:
            1. A clear topic name
            2. Why it's trending now (2-3 sentences)
            3. A relevance score (1-10)
            
            Return as JSON array: [{"topic": "...", "explanation": "...", "relevance_score": 8}, ...]`
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('AI Response:', aiResponse);
    
    // Parse the AI response - handle both plain JSON and markdown-wrapped JSON
    let trends;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = aiResponse.match(/```(?:json)?\s*(\[[\s\S]*\])\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : aiResponse;
      trends = JSON.parse(jsonString.trim());
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      throw new Error('Failed to parse trends from AI response');
    }

    return new Response(JSON.stringify({ trends }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in discover-trends:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});