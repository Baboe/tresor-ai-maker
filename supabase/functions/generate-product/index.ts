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
    const { topic, explanation } = await req.json();
    
    if (!topic) {
      throw new Error('Topic is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Generating product for topic:', topic);

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
            content: `You are TrésorAI, a digital product creator with an elegant, supportive, slightly French tone.
            Create sellable digital products for women 25-45 focused on: manifestation, productivity, self-development, side hustles.
            Return ONLY valid JSON with no markdown formatting.`
          },
          {
            role: 'user',
            content: `Create a complete digital product based on this trending topic:
            
            Topic: ${topic}
            Why it's trending: ${explanation}
            
            Generate a ready-to-sell product with:
            1. Catchy title (max 80 characters)
            2. Two-paragraph description with friendly tone and light emojis 🌸✨
            3. Array of exactly 5 benefits (short phrases)
            4. Price range suggestion (e.g., "€15-€25")
            5. Array of exactly 10 relevant hashtags (just words, no # symbol)
            6. Short social caption (2-3 sentences promoting the product)
            
            Return as JSON:
            {
              "title": "...",
              "description": "...",
              "benefits": ["benefit 1", "benefit 2", ...],
              "price_range": "€15-€25",
              "hashtags": ["word1", "word2", ...],
              "social_caption": "..."
            }`
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
    let productData;
    try {
      const jsonMatch = aiResponse.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : aiResponse;
      productData = JSON.parse(jsonString.trim());
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      throw new Error('Failed to parse product data from AI response');
    }

    return new Response(JSON.stringify({ product: productData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-product:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});