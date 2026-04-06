import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const POLAR_PRO_MONTHLY_ID = "5513f675-e192-4626-815d-375b75d84e43";
const POLAR_PRO_YEARLY_ID = "3652d762-6798-41e9-89d5-3603e0f5a6f5";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const POLAR_ACCESS_TOKEN = Deno.env.get("POLAR_ACCESS_TOKEN");
    if (!POLAR_ACCESS_TOKEN) {
      throw new Error("POLAR_ACCESS_TOKEN is not configured");
    }

    // Verify user auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ isPro: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ isPro: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check for active subscription via Polar — check both monthly and yearly products
    let hasActiveSubscription = false;

    for (const productId of [POLAR_PRO_MONTHLY_ID, POLAR_PRO_YEARLY_ID]) {
      const response = await fetch(
        `https://api.polar.sh/v1/subscriptions/?external_customer_id=${user.id}&active=true&product_id=${productId}`,
        {
          headers: {
            Authorization: `Bearer ${POLAR_ACCESS_TOKEN}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          hasActiveSubscription = true;
          break;
        }
      } else {
        console.error(`Polar API error for product ${productId}: ${response.status}`);
      }
    }

    // Also check user_roles as fallback (for admin)
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);
    const roleList = (roles || []).map((r: any) => r.role);
    const isAdmin = roleList.includes("admin");

    return new Response(
      JSON.stringify({ isPro: hasActiveSubscription || isAdmin }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Pro status check error:", error);
    return new Response(JSON.stringify({ isPro: false }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
