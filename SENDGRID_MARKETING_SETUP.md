# SendGrid Marketing Campaigns Setup Guide

## Overview
This guide will walk you through setting up automated email sequences in SendGrid Marketing Campaigns. Once configured, emails will be sent automatically when users upload restaurants or claim listings.

---

## Step 1: Create Contact Lists in SendGrid

1. **Log into SendGrid** at https://app.sendgrid.com
2. **Navigate to Marketing → Contacts**
3. **Create List #1: CSV Uploads**
   - Click "Create New List"
   - Name: `CSV Upload Sequence`
   - Description: `Users who uploaded restaurants via CSV`
   - Click "Create"
   - **Copy the List ID** (you'll see it in the URL or list details)

4. **Create List #2: Restaurant Claims**
   - Click "Create New List"
   - Name: `Restaurant Claim Sequence`
   - Description: `Users who claimed a restaurant listing`
   - Click "Create"
   - **Copy the List ID**

---

## Step 2: Configure List IDs in Supabase

You need to add the List IDs as secrets in your Supabase Edge Functions:

1. **Go to Supabase Dashboard** → Your Project → Settings → Edge Functions
2. **Add these secrets:**
   - Secret Name: `SENDGRID_CSV_UPLOAD_LIST_ID`
     - Value: [Paste List ID from Step 1.3]

   - Secret Name: `SENDGRID_RESTAURANT_CLAIM_LIST_ID`
     - Value: [Paste List ID from Step 1.4]

3. Click "Save" for each secret

---

## Step 3: Create Automation #1 - CSV Upload Sequence

1. **Navigate to Marketing → Automations**
2. **Click "Create an Automation"**
3. **Select "Custom Automation"**

### Configure the Automation:

**Trigger:**
- Trigger Type: "Contact is added to a list"
- Select List: `CSV Upload Sequence`

**Email 1 - Day 0 (Immediate Welcome):**
- Send: Immediately when added to list
- Subject: `Welcome to SW Florida Dines - Your Restaurant is Now Listed!`
- Content:
  ```
  Hi there!

  Great news! Your restaurant has been added to SW Florida Dines and is now live and visible to potential customers searching for dining options in Southwest Florida.

  Here's what this means for you:
  - Your restaurant is immediately searchable on our directory
  - Customers can view your contact information, hours, and details
  - You're now appearing in search results for your cuisine type and location

  Want to stand out even more? Consider claiming and upgrading your listing to get:
  ✨ Higher visibility in search results
  ✨ Featured placement on the homepage
  ✨ Detailed analytics and insights
  ✨ Custom photo galleries
  ✨ Priority support
  ✨ Ability to update your own information

  [Claim Your Listing] → Link to: https://www.swfldines.com

  Questions? Reply to this email anytime.

  Best regards,
  The SW Florida Dines Team
  ```

**Email 2 - Day 3 (Claim & Upgrade Opportunity):**
- Wait: 3 days after previous email
- Subject: `Take Control of Your Restaurant Listing - Claim It Today!`
- Content:
  ```
  Hi again!

  Your restaurant has been live on SW Florida Dines for 3 days now, and we hope you're starting to see some new customers!

  Did you know you can claim your listing and take full control? When you claim your restaurant, you'll be able to:
  - Update your hours, menu, and contact information anytime
  - Add photos and showcase your restaurant
  - Respond to customer inquiries
  - View analytics to see who's finding you

  Even better - many restaurant owners find that upgrading to a premium listing significantly increases their exposure and customer inquiries.

  Here's what you're missing with a Free listing:
  - Featured placement (your competitors may be showing up first)
  - Detailed analytics (who's viewing, calling, clicking)
  - Photo galleries (customers want to see your space)
  - Priority support (we're here to help you succeed)

  SPECIAL OFFER: Claim and upgrade in the next 4 days and get 20% off your first month!

  [Claim Your Listing Now] → Link to: https://www.swfldines.com

  Still have questions? Just reply to this email.

  Cheers,
  The SW Florida Dines Team
  ```

**Email 3 - Day 7 (Final Nudge + Resources):**
- Wait: 4 days after previous email (7 days total)
- Subject: `Last Chance: Claim & Upgrade Offer Expires Tonight`
- Content:
  ```
  Hi there,

  This is your final reminder that our special 20% upgrade discount expires at midnight tonight!

  Over the past week, thousands of people have browsed SW Florida Dines looking for their next dining experience. Are they finding YOUR restaurant?

  If you haven't already, claim your listing today to:
  ✅ Take control of your restaurant's information
  ✅ Add photos and menus
  ✅ Update hours and contact details
  ✅ See who's viewing your listing

  Then upgrade to a Featured, Premium, or Spotlight listing to:
  ✅ Appear higher in search results
  ✅ Get homepage exposure
  ✅ See detailed analytics about customer interest
  ✅ Showcase unlimited photos

  Don't let this opportunity pass you by.

  [Claim & Upgrade Now - Save 20%] → Link to: https://www.swfldines.com

  If you have any questions or need help getting started, just reply to this email. We're here to help!

  Best,
  The SW Florida Dines Team

  P.S. - This discount won't be offered again, so grab it while you can!
  ```

4. **Click "Activate Automation"**

---

## Step 4: Create Automation #2 - Restaurant Claim Sequence

1. **Navigate to Marketing → Automations**
2. **Click "Create an Automation"**
3. **Select "Custom Automation"**

### Configure the Automation:

**Trigger:**
- Trigger Type: "Contact is added to a list"
- Select List: `Restaurant Claim Sequence`

**Email 1 - Day 0 (Claim Confirmation):**
- Send: Immediately when added to list
- Subject: `Your Restaurant Claim is Being Reviewed!`
- Content:
  ```
  Congratulations!

  You've successfully claimed your restaurant on SW Florida Dines. We're reviewing your claim and will approve it within 24-48 hours.

  What happens next?
  ✅ We verify your ownership
  ✅ You get access to your restaurant dashboard
  ✅ You can update hours, photos, menu, and details
  ✅ You can view analytics and insights

  While you're waiting, did you know you can upgrade your listing to get even more visibility?

  Our Featured and Premium listings get:
  - 5x more profile views
  - 3x more phone calls
  - Homepage placement
  - Priority in search results

  [View Upgrade Options] → Link to: https://www.swfldines.com/pricing

  We'll notify you as soon as your claim is approved!

  Welcome to the SW Florida Dines family,
  The SW Florida Dines Team
  ```

**Email 2 - Day 3 (Upgrade Benefits):**
- Wait: 3 days after previous email
- Subject: `See How Premium Listings Outperform Free Listings`
- Content:
  ```
  Hi again!

  Now that you've claimed your restaurant, have you logged into your dashboard yet?

  You should be seeing some early analytics about who's viewing your listing. But here's the thing - you're only seeing a fraction of what's possible.

  Here's what restaurant owners with Premium listings see:
  📊 10x more profile views per month
  📞 5x more phone calls from customers
  🌟 Featured placement on homepage and in search
  📸 Custom photo galleries that convert browsers into diners

  Real Results from Real Restaurants:
  "Since upgrading to Premium, we've seen a 40% increase in reservations!" - Maria's Italian Kitchen

  "The analytics alone are worth it. I can see exactly when customers are searching for us." - Joe's Seafood Shack

  Want these results for your restaurant?

  [Upgrade to Premium - 20% Off] → Link to: https://www.swfldines.com/pricing?discount=CLAIM20

  Questions? Just reply to this email.

  To your success,
  The SW Florida Dines Team
  ```

**Email 3 - Day 7 (Last Chance + Case Study):**
- Wait: 4 days after previous email (7 days total)
- Subject: `Last Day: Get 20% Off Your Upgrade`
- Content:
  ```
  Hi there,

  Just checking in one more time before this special offer expires tonight at midnight.

  We want to share a quick success story:

  🌟 The Naples Bistro upgraded to Premium 2 months ago. Since then:
  - Profile views increased from 150/month to 1,840/month
  - Phone calls jumped from 12/month to 78/month
  - They now rank #1 for "Italian restaurant Naples"
  - Revenue is up 35%

  This could be YOUR restaurant's story.

  For the price of just 2-3 extra customers per month, you get:
  ✨ Top placement in search results
  ✨ Homepage featured spot
  ✨ Unlimited photos
  ✨ Detailed analytics
  ✨ Priority support

  [Claim Your 20% Discount - Expires Tonight] → Link to: https://www.swfldines.com/pricing?discount=CLAIM20

  This is your last chance to get this discount. After tonight, it's full price.

  Make the smart choice for your restaurant.

  Best regards,
  The SW Florida Dines Team

  P.S. - Not ready to upgrade? That's totally fine! Your free listing will stay active. But don't miss this limited-time discount if you're even thinking about it.
  ```

4. **Click "Activate Automation"**

---

## Step 5: Test the Integration

### Test CSV Upload Flow:
1. Log into your app with a test account
2. Upload a CSV file with restaurants
3. **Check SendGrid:** Go to Marketing → Contacts → CSV Upload Sequence
4. Verify your test email was added to the list
5. **Check your inbox:** You should receive Email #1 immediately

### Test Restaurant Claim Flow:
1. Claim a restaurant in your app
2. **Check SendGrid:** Go to Marketing → Contacts → Restaurant Claim Sequence
3. Verify your email was added to the list
4. **Check your inbox:** You should receive Email #1 immediately

---

## How It Works (Technical Overview)

When a user performs an action:
1. **Frontend triggers** → CSVUploader or App component
2. **Edge function called** → `add-to-sendgrid-list`
3. **SendGrid API** → Contact added to appropriate list
4. **SendGrid Automation** → Watches list and sends emails automatically

**Everything is automatic after initial setup. No manual work required!**

---

## Monitoring and Management

### View Automation Performance:
- Marketing → Automations → Select your automation
- View open rates, click rates, and engagement

### Manage Contacts:
- Marketing → Contacts
- View who's in each list
- Manually add/remove contacts if needed

### Update Email Content:
- Marketing → Automations → Select automation
- Click on any email to edit content
- Changes apply to future emails only (already scheduled emails won't change)

---

## Important Notes

✅ **Fully Automated** - Once set up, requires no manual intervention
✅ **Contacts are added automatically** via your app's edge function
✅ **Emails send on schedule** based on your automation rules
✅ **Separate sequences** for CSV uploads vs. restaurant claims
✅ **You can pause/resume** automations anytime in SendGrid dashboard

---

## Troubleshooting

**Contacts not being added to lists?**
- Check Supabase Edge Function logs for errors
- Verify List IDs are correct in Supabase secrets
- Confirm SENDGRID_API_KEY is still valid

**Emails not sending?**
- Check that automation is "Active" in SendGrid
- Verify contacts are actually in the lists
- Check SendGrid Activity Feed for delivery issues

**Want to change email timing?**
- Edit the automation in SendGrid
- Change wait times between emails
- Changes apply to new contacts only

---

## Support

Need help? Contact:
- SendGrid Support: https://support.sendgrid.com
- Check Edge Function logs in Supabase for integration issues

---

**You're all set!** Once you complete Steps 1-4, your email sequences will run automatically forever. No more manual work! 🎉
