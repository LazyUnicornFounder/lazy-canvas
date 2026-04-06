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

    // Check for active subscription via Polar — try external_customer_id first, then email
    let hasActiveSubscription = false;

    for (const productId of [POLAR_PRO_MONTHLY_ID, POLAR_PRO_YEARLY_ID]) {
      // Try by external_customer_id (linked via checkout)
      const response = await fetch(
        `https://api.polar.sh/v1/subscriptions/?external_customer_id=${user.id}&active=true&product_id=${productId}`,
        { headers: { Authorization: `Bearer ${POLAR_ACCESS_TOKEN}` } }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          hasActiveSubscription = true;
          break;
        }
      }
    }

    // Fallback: search by customer email if not found by external_id
    if (!hasActiveSubscription && user.email) {
      try {
        // Find customer by email
        const custResp = await fetch(
          `https://api.polar.sh/v1/customers/?email=${encodeURIComponent(user.email)}`,
          { headers: { Authorization: `Bearer ${POLAR_ACCESS_TOKEN}` } }
        );
        if (custResp.ok) {
          const custData = await custResp.json();
          const customer = custData.items?.[0];
          if (customer) {
            // Check subscriptions by customer_id
            for (const productId of [POLAR_PRO_MONTHLY_ID, POLAR_PRO_YEARLY_ID]) {
              const subResp = await fetch(
                `https://api.polar.sh/v1/subscriptions/?customer_id=${customer.id}&active=true&product_id=${productId}`,
                { headers: { Authorization: `Bearer ${POLAR_ACCESS_TOKEN}` } }
              );
              if (subResp.ok) {
                const subData = await subResp.json();
                if (subData.items?.length > 0) {
                  hasActiveSubscription = true;

                  // Link the customer for future lookups
                  await fetch(`https://api.polar.sh/v1/customers/${customer.id}`, {
                    method: "PATCH",
                    headers: {
                      Authorization: `Bearer ${POLAR_ACCESS_TOKEN}`,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ external_id: user.id }),
                  });
                  break;
                }
              }
            }
          }
        }
      } catch (e) {
        console.error("Email fallback error:", e);
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
