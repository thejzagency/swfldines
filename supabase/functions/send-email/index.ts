import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface EmailRequest {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  text?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY');

    if (!sendgridApiKey) {
      console.error('SendGrid API key not configured');
      throw new Error('SendGrid API key not configured');
    }

    const emailData: EmailRequest = await req.json();
    console.log('Sending email to:', emailData.to);

    const emailPayload = {
      personalizations: [
        {
          to: [{ email: emailData.to, name: emailData.toName || emailData.to }],
          subject: emailData.subject,
        },
      ],
      from: {
        email: 'admin@swfldines.com',
        name: 'SW Florida Dines',
      },
      content: [
        {
          type: 'text/html',
          value: emailData.html,
        },
      ],
      tracking_settings: {
        click_tracking: {
          enable: false,
          enable_text: false
        },
        open_tracking: {
          enable: true
        },
        subscription_tracking: {
          enable: false
        }
      }
    };

    if (emailData.text) {
      emailPayload.content.unshift({
        type: 'text/plain',
        value: emailData.text,
      });
    }

    console.log('Calling SendGrid API...');
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendgridApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('SendGrid API error:', response.status, errorText);
      throw new Error(`SendGrid error (${response.status}): ${errorText}`);
    }

    console.log('Email sent successfully');
    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Email send error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to send email'
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});