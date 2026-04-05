import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const REMOVE_BG_API_KEY = Deno.env.get("REMOVE_BG_API_KEY");
    if (!REMOVE_BG_API_KEY) {
      throw new Error("REMOVE_BG_API_KEY is not configured");
    }

    const { imageBase64, imageUrl } = await req.json();

    if (!imageBase64 && !imageUrl) {
      throw new Error("Either imageBase64 or imageUrl is required");
    }

    const formData = new FormData();
    formData.append("size", "auto");

    if (imageBase64) {
      // Strip data URI prefix if present
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      const binaryData = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
      const blob = new Blob([binaryData], { type: "image/png" });
      formData.append("image_file", blob, "image.png");
    } else {
      formData.append("image_url", imageUrl);
    }

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": REMOVE_BG_API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Remove.bg error:", response.status, errorText);
      throw new Error(`Remove.bg returned ${response.status}: ${errorText}`);
    }

    const resultBuffer = await response.arrayBuffer();
    const resultBase64 = btoa(
      String.fromCharCode(...new Uint8Array(resultBuffer))
    );
    const resultDataUrl = `data:image/png;base64,${resultBase64}`;

    return new Response(
      JSON.stringify({ imageUrl: resultDataUrl }),
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
