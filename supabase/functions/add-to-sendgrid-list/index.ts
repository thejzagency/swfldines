import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AddContactRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  listType: 'csv_upload' | 'restaurant_claim';
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

    const { email, firstName, lastName, listType }: AddContactRequest = await req.json();

    if (!email || !listType) {
      throw new Error('Email and listType are required');
    }

    console.log(`Adding contact ${email} to ${listType} list`);

    const contactData = {
      list_ids: [listType === 'csv_upload' ? Deno.env.get('SENDGRID_CSV_UPLOAD_LIST_ID') : Deno.env.get('SENDGRID_RESTAURANT_CLAIM_LIST_ID')],
      contacts: [
        {
          email: email,
          first_name: firstName || '',
          last_name: lastName || '',
        },
      ],
    };

    const response = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${sendgridApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('SendGrid API error:', response.status, errorText);
      throw new Error(`SendGrid error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    console.log('Contact added successfully:', result);

    return new Response(
      JSON.stringify({ success: true, message: 'Contact added to list successfully' }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error adding contact to list:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to add contact to list'
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