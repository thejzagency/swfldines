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
  ✨ Up to 5 photos to showcase your restaurant (Featured)
  ✨ Full description section to tell your story (Featured)
  ✨ Featured badge display (Featured)
  ✨ Priority placement in search results (Featured)
  ✨ Analytics dashboard to track visitors (Premium)
  ✨ Up to 15 photos (Premium)
  ✨ Ability to update your own information

  [Claim Your Listing] → Link to: https://www.swfldines.com

  Questions? Reply to this email anytime.

  Best regards,
  The SW Florida Dines Team
  ```

**Email 2 - Day 3 (Claim & Upgrade Opportunity):**
- Wait: 3 days after previous email
- Subject: `Claim Your Restaurant on SWFLDines.com`
- Content:
  ```
  Hi there,

  We noticed you haven't claimed your restaurant listing yet on SWFLDines.com.

  What you get with a Featured listing:

  ✓ Up to 5 photos to showcase your restaurant
  ✓ Full description section to tell your story
  ✓ Links to your website and social media profiles
  ✓ Menu link for easy customer access
  ✓ Featured badge on your listing
  ✓ Priority placement in search results

  Ready to claim your restaurant?

  1. Go to SWFLDines.com
  2. Search for your restaurant
  3. Click "View Details"
  4. Click "Claim This Restaurant"

  Featured listings are $29.99/month and give you full control over how your restaurant appears to potential customers.

  Questions? Just reply to this email.

  Best regards,
  The SW Florida Dines Team
  ```

**Email 3 - Day 7 (Final Nudge + Resources):**
- Wait: 4 days after previous email (7 days total)
- Subject: `Upgrade Your Restaurant Listing on SW Florida Dines`
- Content:
  ```
  Hi there,

  This is your final reminder that our special 20% upgrade discount expires at midnight tonight!

  Over the past week, thousands of people have browsed SW Florida Dines looking for their next dining experience. Are they finding YOUR restaurant?

  If you haven't already, claim your listing today to:
  ✅ Take control of your restaurant's information
  ✅ Update hours and contact details
  ✅ Add website and social media links

  Then upgrade to a Featured, Premium, or Spotlight listing to:
  ✅ Add photo galleries (5 photos with Featured, 15 with Premium, unlimited with Spotlight)
  ✅ Appear higher in search results
  ✅ Full description section to tell your story
  ✅ Analytics dashboard (Premium and above)

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

  Our Featured listings ($29/month) include:
  - Up to 5 photo gallery images
  - Full description section
  - Featured badge display
  - Priority in search results

  Our Premium listings ($59/month) include:
  - Everything in Featured
  - Up to 15 photos
  - Visitor analytics dashboard
  - Click & engagement tracking

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

  Now that you've claimed your restaurant, we wanted to let you know about the upgrade options available to help you attract more customers.

  Featured Listing ($29/month):
  ✓ Up to 5 photos to showcase your restaurant
  ✓ Full description section to tell your story
  ✓ Links to your website and social media
  ✓ Featured badge on your listing
  ✓ Priority placement in search results

  Premium Listing ($59/month):
  ✓ Everything in Featured
  ✓ Up to 15 photos
  ✓ Visitor analytics dashboard
  ✓ Click & engagement tracking
  ✓ 30-day performance history

  Spotlight Listing ($99/month):
  ✓ Everything in Premium
  ✓ Unlimited photos
  ✓ Homepage featured spot
  ✓ Advanced analytics with 90-day history
  ✓ Priority support

  [View All Pricing Options] → Link to: https://www.swfldines.com/pricing

  Questions? Just reply to this email.

  To your success,
  The SW Florida Dines Team
  ```

**Email 3 - Day 7 (Last Chance + Case Study):**
- Wait: 4 days after previous email (7 days total)
- Subject: `Upgrade Options for Your Restaurant Listing`
- Content:
  ```
  Hi there,

  This is our final reminder about upgrading your restaurant listing on SW Florida Dines.

  Your free listing is active, but upgrading helps you reach more customers:

  Featured Listing ($29/month):
  ✓ 5 photos to showcase your restaurant
  ✓ Full description section
  ✓ Featured badge & priority in search

  Premium Listing ($59/month):
  ✓ Everything in Featured
  ✓ 15 photos
  ✓ Analytics dashboard to track visitors
  ✓ 30-day performance history

  Spotlight Listing ($99/month):
  ✓ Everything in Premium
  ✓ Unlimited photos
  ✓ Homepage featured placement
  ✓ 90-day analytics & priority support

  [View Pricing & Upgrade] → Link to: https://www.swfldines.com/pricing

  Your free listing will continue to work just fine if you choose not to upgrade.

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
