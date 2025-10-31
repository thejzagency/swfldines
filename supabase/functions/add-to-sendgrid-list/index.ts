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
  // Handle CORS preflight immediately
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY');
    const csvUploadListId = Deno.env.get('SENDGRID_CSV_UPLOAD_LIST_ID');
    const restaurantClaimListId = Deno.env.get('SENDGRID_RESTAURANT_CLAIM_LIST_ID');

    console.log('Environment check:', {
      hasApiKey: !!sendgridApiKey,
      hasCsvListId: !!csvUploadListId,
      hasClaimListId: !!restaurantClaimListId
    });

    if (!sendgridApiKey) {
      console.error('SendGrid API key not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'SendGrid API key not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { email, firstName, lastName, listType }: AddContactRequest = await req.json();

    if (!email || !listType) {
      return new Response(
        JSON.stringify({ success: false, error: 'Email and listType are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`Adding contact ${email} to ${listType} list`);

    const listId = listType === 'csv_upload' ? csvUploadListId : restaurantClaimListId;
    
    if (!listId) {
      console.error(`List ID not configured for ${listType}`);
      return new Response(
        JSON.stringify({ success: false, error: `List ID not configured for ${listType}` }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const contactData = {
      list_ids: [listId],
      contacts: [
        {
          email: email,
          first_name: firstName || '',
          last_name: lastName || '',
        },
      ],
    };

    console.log('Sending to SendGrid:', JSON.stringify(contactData, null, 2));

    const response = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${sendgridApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });

    const responseText = await response.text();
    console.log('SendGrid response:', response.status, responseText);

    if (!response.ok) {
      console.error('SendGrid API error:', response.status, responseText);
      return new Response(
        JSON.stringify({
          success: false,
          error: `SendGrid error (${response.status}): ${responseText}`
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const result = JSON.parse(responseText);
    console.log('Contact added successfully:', result);

    return new Response(
      JSON.stringify({ success: true, message: 'Contact added to list successfully', data: result }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error adding contact to list:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add contact to list'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
