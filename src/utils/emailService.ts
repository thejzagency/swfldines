import { supabase } from '../lib/supabase';
import { env } from '../config/env';

interface EmailOptions {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  text?: string;
  templateId?: string;
  restaurantId?: string;
  userId?: string;
  metadata?: any;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  text_content: string;
  variables: string[];
}

export class EmailService {
  private static FROM_EMAIL = 'admin@swfldines.com';
  private static FROM_NAME = 'SW Florida Dines';
  private static ADMIN_EMAIL = 'admin@swfldines.com';
  private static CLAIM_NOTIFICATION_EMAIL = 'jimzimmermann@gmail.com';

  static async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || env.supabaseAnonKey;

      const response = await fetch(
        `${env.supabaseUrl}/functions/v1/send-email`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'apikey': env.supabaseAnonKey
          },
          body: JSON.stringify({
            to: options.to,
            toName: options.toName,
            subject: options.subject,
            html: options.html,
            text: options.text
          })
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        await this.logEmail({
          recipient_email: options.to,
          recipient_name: options.toName || '',
          subject: options.subject,
          template_id: options.templateId,
          restaurant_id: options.restaurantId,
          user_id: options.userId,
          status: 'sent',
          metadata: options.metadata
        });
        return true;
      } else {
        await this.logEmail({
          recipient_email: options.to,
          recipient_name: options.toName || '',
          subject: options.subject,
          template_id: options.templateId,
          restaurant_id: options.restaurantId,
          user_id: options.userId,
          status: 'failed',
          error_message: result.error || 'Unknown error',
          metadata: options.metadata
        });
        console.error('Email send error:', result.error);
        return false;
      }
    } catch (error: any) {
      console.error('Email sending error:', error);
      await this.logEmail({
        recipient_email: options.to,
        recipient_name: options.toName || '',
        subject: options.subject,
        template_id: options.templateId,
        restaurant_id: options.restaurantId,
        user_id: options.userId,
        status: 'failed',
        error_message: error.message,
        metadata: options.metadata
      });
      return false;
    }
  }

  private static getHardcodedTemplate(templateName: string): { subject: string; html: string; text: string } | null {
    const templates: Record<string, { subject: string; html: string; text: string }> = {
      'restaurant_verification': {
        subject: 'Claim Your Restaurant Listing on SW Florida Dines',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c3e50;">Welcome to SW Florida Dines!</h2>
            <p>Hi there,</p>
            <p>We've added <strong>{{restaurant_name}}</strong> in {{city}} to our restaurant directory!</p>
            <p>You can claim your listing and get access to premium features:</p>
            <ul>
              <li>Update your restaurant information</li>
              <li>Add photos and menu items</li>
              <li>Respond to reviews</li>
              <li>Track analytics</li>
            </ul>
            <p style="margin: 30px 0;">
              <a href="{{verification_link}}" style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Claim Your Listing
              </a>
            </p>
            <p>If you have any questions, feel free to reply to this email.</p>
            <p>Best regards,<br>SW Florida Dines Team</p>
          </div>
        `,
        text: `Welcome to SW Florida Dines!\n\nWe've added {{restaurant_name}} in {{city}} to our restaurant directory!\n\nClaim your listing here: {{verification_link}}\n\nBest regards,\nSW Florida Dines Team`
      }
    };

    return templates[templateName] || null;
  }

  static async sendFromTemplate(
    templateName: string,
    to: string,
    variables: Record<string, string>,
    options?: {
      toName?: string;
      restaurantId?: string;
      userId?: string;
      metadata?: any;
    }
  ): Promise<boolean> {
    try {
      console.log('[EmailService] Getting template:', templateName);

      const template = this.getHardcodedTemplate(templateName);

      if (!template) {
        console.error('[EmailService] Template not found:', templateName);
        return false;
      }

      let html = template.html;
      let text = template.text;
      let subject = template.subject;

      Object.entries(variables).forEach(([key, value]) => {
        const placeholder = `{{${key}}}`;
        html = html.replace(new RegExp(placeholder, 'g'), value);
        text = text.replace(new RegExp(placeholder, 'g'), value);
        subject = subject.replace(new RegExp(placeholder, 'g'), value);
      });

      console.log('[EmailService] Sending email with subject:', subject);

      return await this.sendEmail({
        to,
        toName: options?.toName,
        subject,
        html,
        text,
        templateId: templateName,
        restaurantId: options?.restaurantId,
        userId: options?.userId,
        metadata: options?.metadata
      });
    } catch (error) {
      console.error('[EmailService] Error sending template email:', error);
      return false;
    }
  }

  private static async logEmail(data: {
    recipient_email: string;
    recipient_name: string;
    subject: string;
    template_id?: string;
    restaurant_id?: string;
    user_id?: string;
    status: string;
    sendgrid_message_id?: string;
    error_message?: string;
    metadata?: any;
  }): Promise<void> {
    try {
      await supabase.from('email_logs').insert([data]);
    } catch (error) {
      console.error('Failed to log email:', error);
    }
  }

  static async notifyAdminNewRestaurant(
    restaurantName: string,
    city: string,
    restaurantId: string
  ): Promise<boolean> {
    const adminLink = `${window.location.origin}/#admin`;

    return await this.sendFromTemplate(
      'admin_new_restaurant',
      this.ADMIN_EMAIL,
      {
        restaurant_name: restaurantName,
        city: city,
        admin_link: adminLink
      },
      {
        restaurantId,
        metadata: { type: 'new_restaurant_notification' }
      }
    );
  }

  static async notifyAdminRestaurantClaimed(
    restaurantName: string,
    ownerEmail: string,
    restaurantId: string
  ): Promise<boolean> {
    const adminLink = `${window.location.origin}/#admin`;

    return await this.sendFromTemplate(
      'admin_restaurant_claimed',
      this.CLAIM_NOTIFICATION_EMAIL,
      {
        restaurant_name: restaurantName,
        owner_email: ownerEmail,
        admin_link: adminLink
      },
      {
        restaurantId,
        metadata: { type: 'restaurant_claimed_notification' }
      }
    );
  }

  // Note: Email sequences are now handled by SendGrid Marketing automation
  // When users are added to SendGrid lists, SendGrid handles the email sequence automatically
}
