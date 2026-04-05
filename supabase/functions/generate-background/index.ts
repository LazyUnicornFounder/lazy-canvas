import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      throw new Error("A prompt is required");
    }

    // Use Gemini image model via Lovable AI proxy
    const response = await fetch("https://ai-proxy.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3.1-flash-image-preview",
        messages: [
          {
            role: "user",
            content: `Generate a beautiful, high-quality background image for a quote card. The image should be atmospheric, slightly abstract, and work well as a backdrop for overlaid text. Style: ${prompt}. Do NOT include any text in the image.`,
          },
        ],
        // Request image generation
        response_modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI proxy error:", response.status, errorText);
      throw new Error(`AI proxy returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    // Extract the image from the response
    // Gemini image models return inline_data in the content parts
    const message = data.choices?.[0]?.message;
    let imageData: string | null = null;

    if (message?.content) {
      // Check if content is an array of parts (multimodal response)
      if (Array.isArray(message.content)) {
        for (const part of message.content) {
          if (part.type === "image_url" && part.image_url?.url) {
            imageData = part.image_url.url;
            break;
          }
        }
      }
    }

    if (!imageData) {
      console.error("Full response:", JSON.stringify(data));
      throw new Error("No image was generated. The model may not have returned an image.");
    }

    return new Response(
      JSON.stringify({ imageUrl: imageData }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
