/*
  # Email Tracking and Automation System

  1. New Tables
    - `email_logs`
      - Tracks all emails sent through the system
      - Records success/failure status
      - Stores email metadata for audit trail
    
    - `email_sequences`
      - Defines automated email series
      - Tracks which restaurants are in which sequence
      - Manages timing and progression through series
    
    - `email_templates`
      - Stores reusable email templates
      - Supports dynamic content with placeholders
      - Version control for templates

  2. Security
    - Enable RLS on all tables
    - Admin-only access for reading email logs
    - System-level access for creating email logs

  3. Notes
    - Email logs never expire (permanent audit trail)
    - Sequences track restaurant engagement
    - Templates support dynamic variables
*/

-- Email logs table for tracking all sent emails
CREATE TABLE IF NOT EXISTS email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email text NOT NULL,
  recipient_name text DEFAULT '',
  subject text NOT NULL,
  template_id uuid,
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text NOT NULL CHECK (status IN ('queued', 'sent', 'failed', 'bounced', 'opened', 'clicked')),
  sendgrid_message_id text,
  error_message text,
  metadata jsonb DEFAULT '{}',
  sent_at timestamptz DEFAULT now(),
  opened_at timestamptz,
  clicked_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Email templates for reusable content
CREATE TABLE IF NOT EXISTS email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text DEFAULT '',
  subject text NOT NULL,
  html_content text NOT NULL,
  text_content text,
  category text NOT NULL CHECK (category IN ('verification', 'upsell', 'admin_notification', 'confirmation', 'reminder')),
  variables jsonb DEFAULT '[]',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Email sequences for automated campaigns
CREATE TABLE IF NOT EXISTS email_sequences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  sequence_type text NOT NULL CHECK (sequence_type IN ('verification', 'upsell', 'engagement')),
  current_step integer DEFAULT 0,
  total_steps integer NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  last_email_sent_at timestamptz,
  next_email_scheduled_at timestamptz,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sequences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for email_logs
CREATE POLICY "Admins can view all email logs"
  ON email_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "System can create email logs"
  ON email_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for email_templates
CREATE POLICY "Admins can manage email templates"
  ON email_templates FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Anyone can read active templates"
  ON email_templates FOR SELECT
  TO authenticated
  USING (is_active = true);

-- RLS Policies for email_sequences
CREATE POLICY "Admins can view all email sequences"
  ON email_sequences FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "System can manage email sequences"
  ON email_sequences FOR ALL
  TO authenticated
  USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_logs_restaurant_id ON email_logs(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at);
CREATE INDEX IF NOT EXISTS idx_email_sequences_restaurant_id ON email_sequences(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_email_sequences_status ON email_sequences(status);
CREATE INDEX IF NOT EXISTS idx_email_sequences_next_scheduled ON email_sequences(next_email_scheduled_at);

-- Insert default email templates
INSERT INTO email_templates (name, description, subject, html_content, text_content, category, variables) VALUES
(
  'restaurant_verification',
  'Initial email sent to uploaded restaurants for verification',
  'Verify Your Restaurant Listing on SW Florida Dines',
  '<h1>Welcome to SW Florida Dines!</h1><p>Hi {{restaurant_name}},</p><p>We''ve added your restaurant to our directory. Please verify your listing and claim it to manage your information.</p><p><a href="{{verification_link}}">Verify & Claim Your Restaurant</a></p><p>Best regards,<br>SW Florida Dines Team</p>',
  'Welcome to SW Florida Dines! Please verify your restaurant listing at: {{verification_link}}',
  'verification',
  '["restaurant_name", "verification_link", "city"]'
),
(
  'upsell_featured',
  'First upsell email promoting Featured listing',
  'Stand Out with a Featured Listing on SW Florida Dines',
  '<h1>Get More Visibility!</h1><p>Hi {{restaurant_name}},</p><p>Upgrade to a Featured listing and get 3x more views. Featured restaurants appear at the top of search results.</p><p><strong>Featured Listing - $29/month</strong></p><ul><li>Priority placement</li><li>Badge on listing</li><li>3x more visibility</li></ul><p><a href="{{upgrade_link}}">Upgrade Now</a></p>',
  'Upgrade to Featured listing for $29/month and get 3x more views!',
  'upsell',
  '["restaurant_name", "upgrade_link"]'
),
(
  'upsell_premium',
  'Second upsell email promoting Premium listing',
  'Maximize Your Restaurant''s Online Presence',
  '<h1>Go Premium!</h1><p>Hi {{restaurant_name}},</p><p>Premium listings get 5x more engagement and include exclusive features.</p><p><strong>Premium Listing - $49/month</strong></p><ul><li>Top placement in all searches</li><li>Photo gallery</li><li>Social media integration</li><li>Advanced analytics</li></ul><p><a href="{{upgrade_link}}">Upgrade to Premium</a></p>',
  'Premium listing for $49/month - 5x more engagement with exclusive features!',
  'upsell',
  '["restaurant_name", "upgrade_link"]'
),
(
  'admin_new_restaurant',
  'Notify admin when new restaurant is submitted',
  'New Restaurant Submission - Action Required',
  '<h1>New Restaurant Submitted</h1><p>A new restaurant has been submitted for approval:</p><p><strong>{{restaurant_name}}</strong><br>{{city}}, FL</p><p><a href="{{admin_link}}">Review in Admin Panel</a></p>',
  'New restaurant submitted: {{restaurant_name}} in {{city}}, FL',
  'admin_notification',
  '["restaurant_name", "city", "admin_link"]'
),
(
  'admin_restaurant_claimed',
  'Notify admin when restaurant is claimed',
  'Restaurant Claimed - Verification Required',
  '<h1>Restaurant Claimed</h1><p>A restaurant owner has claimed their listing:</p><p><strong>{{restaurant_name}}</strong><br>Claimed by: {{owner_email}}</p><p><a href="{{admin_link}}">Review Claim</a></p>',
  'Restaurant claimed: {{restaurant_name}} by {{owner_email}}',
  'admin_notification',
  '["restaurant_name", "owner_email", "admin_link"]'
)
ON CONFLICT (name) DO NOTHING;