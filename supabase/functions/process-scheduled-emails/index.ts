import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const BATCH_SIZE = 50;
const DELAY_BETWEEN_EMAILS_MS = 100;

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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
      .lte("next_email_scheduled_at", new Date().toISOString())
      .limit(BATCH_SIZE);

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

        if (sequence.sequence_type === "claim_reminder") {
          const claimLink = `${supabaseUrl.replace("/v1", "")}?restaurant=${sequence.restaurant_id}`;

          if (sequence.current_step === 0) {
            templateName = "claim_reminder_1";
            subject = `Reminder: Claim Your Restaurant on SW Florida Dines`;
            html = `
              <h2>Hi ${restaurant.name}!</h2>
              <p>We noticed you haven't claimed your restaurant listing yet.</p>
              <p>By claiming your listing, you can:</p>
              <ul>
                <li>&#10003; Update your information</li>
                <li>&#10003; Respond to customers</li>
                <li>&#10003; Add photos and menus</li>
                <li>&#10003; Manage your online presence</li>
              </ul>
              <p><a href="${claimLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Claim Your Restaurant</a></p>
              <p>Best regards,<br>SW Florida Dines Team</p>
            `;
          } else if (sequence.current_step === 1) {
            templateName = "claim_reminder_2";
            subject = `Don't Miss Out - Claim ${restaurant.name} Today`;
            html = `
              <h2>Hi ${restaurant.name}!</h2>
              <p>Your restaurant listing is still unclaimed. Don't let potential customers miss out on accurate information!</p>
              <p>Claiming takes less than 2 minutes and gives you full control over your listing.</p>
              <p><a href="${claimLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Claim Your Restaurant Now</a></p>
              <p>Best regards,<br>SW Florida Dines Team</p>
            `;
          } else {
            templateName = "claim_reminder_final";
            subject = `Last Chance - Claim Your Restaurant Listing`;
            html = `
              <h2>Hi ${restaurant.name}!</h2>
              <p>This is our final reminder about your unclaimed restaurant listing.</p>
              <p>After this, we won't send any more reminders, but your restaurant will remain visible to customers with the current information.</p>
              <p>To ensure your listing is accurate and up-to-date, claim it now:</p>
              <p><a href="${claimLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Claim Your Restaurant</a></p>
              <p>Best regards,<br>SW Florida Dines Team</p>
            `;
          }

          const emailResponse = await fetch(
            `${supabaseUrl}/functions/v1/smooth-task`,
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
        } else if (sequence.sequence_type === "upsell") {
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
                <li>&#10003; 5 photo gallery images</li>
                <li>&#10003; Featured badge display</li>
                <li>&#10003; Priority in search results</li>
                <li>&#10003; Website & social media links</li>
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
                <li>&#10003; Everything in Featured</li>
                <li>&#10003; 15 photo gallery images</li>
                <li>&#10003; Visitor analytics dashboard</li>
                <li>&#10003; Click & engagement tracking</li>
                <li>&#10003; 30-day performance history</li>
              </ul>
              <p><a href="${upgradeLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Upgrade to Premium</a></p>
              <p>Best regards,<br>SW Florida Dines Team</p>
            `;
          }

          const emailResponse = await fetch(
            `${supabaseUrl}/functions/v1/smooth-task`,
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
            let daysToAdd = 7;

            if (sequence.sequence_type === "claim_reminder") {
              daysToAdd = nextStep === 1 ? 3 : 7;
            }

            nextEmailDate.setDate(nextEmailDate.getDate() + daysToAdd);

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

      await sleep(DELAY_BETWEEN_EMAILS_MS);
    }

    const { count: remainingCount } = await supabase
      .from("email_sequences")
      .select("*", { count: "exact", head: true })
      .eq("status", "active")
      .lte("next_email_scheduled_at", new Date().toISOString());

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${processedCount} scheduled emails`,
        processed: processedCount,
        total: sequences.length,
        remaining: remainingCount || 0,
        batchSize: BATCH_SIZE,
        note: remainingCount && remainingCount > 0
          ? `${remainingCount} more emails queued for next hourly run`
          : "All scheduled emails processed",
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