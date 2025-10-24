import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: sequences, error: fetchError } = await supabase
      .from("email_sequences")
      .select("*, restaurants(id, name, email)")
      .eq("status", "active")
      .lte("next_email_scheduled_at", new Date().toISOString());

    if (fetchError) {
      throw fetchError;
    }

    if (!sequences || sequences.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "No scheduled emails to process",
          processed: 0,
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    let processedCount = 0;
    const results = [];

    for (const sequence of sequences) {
      const restaurant = sequence.restaurants as any;
      if (!restaurant || !restaurant.email) {
        results.push({
          sequenceId: sequence.id,
          status: "skipped",
          reason: "No restaurant email",
        });
        continue;
      }

      try {
        let emailSent = false;
        let templateName = "";
        let subject = "";
        let html = "";

        if (sequence.sequence_type === "upsell") {
          const tier = sequence.current_step === 0 ? "featured" : "premium";
          templateName = tier === "featured" ? "upsell_featured" : "upsell_premium";

          const upgradeLink = `${supabaseUrl.replace("/v1", "")}/pricing`;

          if (tier === "featured") {
            subject = `Boost Your Restaurant's Visibility - Featured Listing`;
            html = `
              <h2>Hi ${restaurant.name}!</h2>
              <p>We've noticed you claimed your restaurant listing - that's great!</p>
              <p>Want to stand out even more? Upgrade to a <strong>Featured Listing</strong> for just $29/month:</p>
              <ul>
                <li>✓ 5 photo gallery images</li>
                <li>✓ Featured badge display</li>
                <li>✓ Priority in search results</li>
                <li>✓ Website & social media links</li>
              </ul>
              <p><a href="${upgradeLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Upgrade Now</a></p>
              <p>Best regards,<br>SW Florida Dines Team</p>
            `;
          } else {
            subject = `Unlock Advanced Analytics - Premium Listing`;
            html = `
              <h2>Hi ${restaurant.name}!</h2>
              <p>Ready to take your listing to the next level?</p>
              <p>Upgrade to <strong>Premium</strong> for $59/month and get:</p>
              <ul>
                <li>✓ Everything in Featured</li>
                <li>✓ 15 photo gallery images</li>
                <li>✓ Visitor analytics dashboard</li>
                <li>✓ Click & engagement tracking</li>
                <li>✓ 30-day performance history</li>
              </ul>
              <p><a href="${upgradeLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Upgrade to Premium</a></p>
              <p>Best regards,<br>SW Florida Dines Team</p>
            `;
          }

          const emailResponse = await fetch(
            `${supabaseUrl}/functions/v1/send-email`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${supabaseServiceKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                to: restaurant.email,
                toName: restaurant.name,
                subject: subject,
                html: html,
              }),
            }
          );

          const emailResult = await emailResponse.json();
          emailSent = emailResponse.ok && emailResult.success;
        }

        if (emailSent) {
          const nextStep = sequence.current_step + 1;
          const isComplete = nextStep >= sequence.total_steps;

          if (isComplete) {
            await supabase
              .from("email_sequences")
              .update({
                current_step: nextStep,
                status: "completed",
                last_email_sent_at: new Date().toISOString(),
              })
              .eq("id", sequence.id);
          } else {
            const nextEmailDate = new Date();
            nextEmailDate.setDate(nextEmailDate.getDate() + 7);

            await supabase
              .from("email_sequences")
              .update({
                current_step: nextStep,
                last_email_sent_at: new Date().toISOString(),
                next_email_scheduled_at: nextEmailDate.toISOString(),
              })
              .eq("id", sequence.id);
          }

          processedCount++;
          results.push({
            sequenceId: sequence.id,
            restaurantName: restaurant.name,
            status: "success",
            template: templateName,
          });
        } else {
          results.push({
            sequenceId: sequence.id,
            restaurantName: restaurant.name,
            status: "failed",
            reason: "Email send failed",
          });
        }
      } catch (error: any) {
        results.push({
          sequenceId: sequence.id,
          restaurantName: restaurant.name,
          status: "error",
          error: error.message,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${processedCount} scheduled emails`,
        processed: processedCount,
        total: sequences.length,
        results: results,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.error("Error processing scheduled emails:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
