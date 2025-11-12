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
            content: `You are creating a market-tested digital workbook/planner for 2025-2026 based on this trending topic:

            Topic: ${topic}
            Why it's trending: ${explanation}

            It must solve a specific problem in its niche, follow a clear, supportive, and professional tone, and avoid any French words, emojis, or price references.
            Focus on creating a resource that helps users organize, track, or improve a particular area of their life (e.g., productivity, budgeting, wellness, study, fitness).

            Output format (as JSON):
            {
              "title": "...",
              "tagline": "...",
              "introduction": "...",
              "pillars": [
                { "name": "...", "description": "...", "why_it_matters": "...", "how_to_apply": "..." }
              ],
              "worksheets": [
                "Daily Planner",
                "Weekly Reflection",
                "Goal Setting Framework",
                "Habit Tracker",
                "Priority Organizer",
                "Action Steps Worksheet",
                "Mind Dump Page",
                "Review Section"
              ],
              "bonus_assets": [
                "Guided video or audio overview of the workbook",
                "Editable spreadsheet template (e.g., budget tracker)",
                "Printable checklists",
                "Digital stickers or icons",
                "A mini-ebook summarizing the core concepts"
              ],
              "reflection_questions": ["...", "..."],
              "next_steps": "...",
              "benefits": ["benefit 1", "benefit 2", "benefit 3", "benefit 4", "benefit 5"],
              "price_range": "€15-€25",
              "hashtags": ["word1", "word2", "word3", "word4", "word5", "word6", "word7", "word8", "word9", "word10"],
              "social_caption": "..."
            }

            Guidelines:
            1. Title: Concise, benefit-focused, specific about the problem it solves
            2. Tagline: One-sentence transformation summary
            3. Introduction: Address main challenge, explain who it's for and why it's effective (2-3 paragraphs)
            4. Core Framework: 3-5 pillars with name, description, why_it_matters, how_to_apply
            5. Worksheets & Tools: 6-10 interactive sections (planners, trackers, frameworks)
            6. Bonus Assets: Supplementary materials to increase value
            7. Reflection Questions: 10-15 thoughtful, open-ended questions
            8. Next Steps: Guidance on integrating practices into routine
            9. Benefits: 5 short benefit phrases
            10. Price Range: Suggested pricing (e.g., "€15-€25")
            11. Hashtags: 10 relevant keywords (no # symbol)
            12. Social Caption: 2-3 sentences promoting the product

            Ensure content is complete, actionable, tailored to the topic's problem area, and feels like a premium product.`
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