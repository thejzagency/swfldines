# Production Deployment Checklist

## Pre-Deployment Steps

### 1. Environment Configuration ✅ COMPLETED
- [x] Database credentials hardcoded in `src/config/env.ts`
- [x] API keys removed from client-side code
- [x] Environment variables properly configured in `.env`
- [x] Netlify environment variables configured

### 2. Security ✅ COMPLETED
- [x] Security headers configured in `netlify.toml`
- [x] Content Security Policy implemented
- [x] HTTPS enforcement configured
- [x] API keys moved to server-side Edge Functions
- [x] Row Level Security (RLS) enabled on all tables

### 3. Edge Functions (Supabase)

#### Required Edge Functions:
1. **send-email** - Handles SendGrid email sending
   - Location: `supabase/functions/send-email/index.ts`
   - Required env var: `SENDGRID_API_KEY`

2. **claim-restaurant** - Handles restaurant claims
   - Location: `supabase/functions/claim-restaurant/index.ts`
   - Already deployed

3. **create-checkout-session** - Creates Stripe checkout sessions
   - Location: `supabase/functions/create-checkout-session/index.ts`
   - Required env var: `STRIPE_SECRET_KEY`

4. **stripe-webhook** - Handles Stripe webhook events
   - Location: `supabase/functions/stripe-webhook/index.ts`
   - Required env vars: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`

#### Deploy Edge Functions:
```bash
# Deploy all edge functions
supabase functions deploy send-email
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
supabase functions deploy claim-restaurant
```

#### Configure Supabase Secrets:
```bash
supabase secrets set SENDGRID_API_KEY=your_sendgrid_api_key
supabase secrets set STRIPE_SECRET_KEY=your_stripe_secret_key
supabase secrets set STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### 4. Stripe Configuration

#### Set Up Products and Prices:
1. Log into Stripe Dashboard
2. Create products:
   - **Featured** - $49/month
   - **Premium** - $99/month
   - **Premium Plus** - $199/month
3. Copy Price IDs and update in `supabase/functions/create-checkout-session/index.ts`

#### Configure Webhook:
1. In Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://wiosivnwuqroaoqojlse.supabase.co/functions/v1/stripe-webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy webhook signing secret
5. Set in Supabase: `supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...`

### 5. SendGrid Configuration

1. Create SendGrid account and verify sender domain
2. Create API key with full access
3. Set in Supabase: `supabase secrets set SENDGRID_API_KEY=SG....`
4. Verify sender email: noreply@swfldines.com
5. Create email templates in database

### 6. Database ✅ COMPLETED
- [x] All migrations applied
- [x] RLS policies configured
- [x] Admin user created
- [x] Email templates populated
- [x] Restaurant data loaded

### 7. Application Features ✅ COMPLETED
- [x] Error boundaries implemented
- [x] SEO meta tags added
- [x] Analytics tracking ready
- [x] Stripe checkout flow implemented
- [x] Email service configured
- [x] Restaurant claiming functional
- [x] Admin dashboard working

## Deployment Steps

### 1. Build and Test
```bash
npm run build
npm run preview
```

### 2. Deploy to Netlify
```bash
# Push to GitHub
git add .
git commit -m "Production ready"
git push origin main

# Netlify will auto-deploy
```

### 3. Post-Deployment Verification

#### Test Checklist:
- [ ] Homepage loads correctly
- [ ] Restaurant search and filters work
- [ ] Restaurant modal displays properly
- [ ] User signup/login works
- [ ] Restaurant claiming process works
- [ ] Admin dashboard accessible
- [ ] Email notifications send
- [ ] Stripe checkout works (use test mode first)
- [ ] Mobile responsiveness
- [ ] Performance (Lighthouse score > 90)

#### Security Checks:
- [ ] HTTPS enforced
- [ ] Security headers present (check with securityheaders.com)
- [ ] No API keys exposed in client code
- [ ] RLS policies preventing unauthorized access

## Environment Variables Reference

### Client-Side (VITE_ prefix - safe to expose)
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key (public)
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key (public)
- `VITE_SITE_URL` - Site URL (https://www.swfldines.com)

### Server-Side (Supabase Secrets - NEVER expose)
- `SENDGRID_API_KEY` - SendGrid API key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret

## Known Issues & Solutions

### Issue: .env file reverting to wrong database
**Solution:** Database credentials are now hardcoded in `src/config/env.ts` and will always use the correct database regardless of .env file contents.

### Issue: Stripe checkout not working
**Solution:** Ensure Price IDs in edge function match your Stripe product prices.

### Issue: Emails not sending
**Solution:** Verify SendGrid API key is set in Supabase secrets and sender email is verified.

## Support & Monitoring

### Monitoring
- Supabase Dashboard: https://supabase.com/dashboard/project/wiosivnwuqroaoqojlse
- Netlify Dashboard: https://app.netlify.com
- Stripe Dashboard: https://dashboard.stripe.com

### Logs
- Edge Function logs: Supabase > Edge Functions > Logs
- Application errors: Browser console + Netlify logs

## Final Production Checklist
- [ ] All edge functions deployed
- [ ] Supabase secrets configured
- [ ] Stripe products created and configured
- [ ] Stripe webhook configured
- [ ] SendGrid verified and configured
- [ ] DNS configured for custom domain
- [ ] SSL certificate active
- [ ] Performance tested
- [ ] Security tested
- [ ] Backup strategy implemented
