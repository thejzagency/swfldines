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
      const { data: template, error } = await supabase
        .from('email_templates')
        .select('*')
        .eq('name', templateName)
        .eq('is_active', true)
        .maybeSingle();

      if (error || !template) {
        console.error('Template not found:', templateName);
        return false;
      }

      let html = template.html_content;
      let text = template.text_content || '';
      let subject = template.subject;

      Object.entries(variables).forEach(([key, value]) => {
        const placeholder = `{{${key}}}`;
        html = html.replace(new RegExp(placeholder, 'g'), value);
        text = text.replace(new RegExp(placeholder, 'g'), value);
        subject = subject.replace(new RegExp(placeholder, 'g'), value);
      });

      return await this.sendEmail({
        to,
        toName: options?.toName,
        subject,
        html,
        text,
        templateId: template.id,
        restaurantId: options?.restaurantId,
        userId: options?.userId,
        metadata: options?.metadata
      });
    } catch (error) {
      console.error('Error sending template email:', error);
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

  static async sendRestaurantVerification(
    restaurantId: string,
    restaurantName: string,
    email: string,
    city: string
  ): Promise<boolean> {
    const verificationLink = `${window.location.origin}?restaurant=${restaurantId}`;

    return await this.sendFromTemplate(
      'restaurant_verification',
      email,
      {
        restaurant_name: restaurantName,
        verification_link: verificationLink,
        city: city
      },
      {
        toName: restaurantName,
        restaurantId
      }
    );
  }

  static async sendUpsellEmail(
    restaurantId: string,
    restaurantName: string,
    email: string,
    tier: 'featured' | 'premium'
  ): Promise<boolean> {
    const upgradeLink = `${window.location.origin}/pricing`;
    const templateName = tier === 'featured' ? 'upsell_featured' : 'upsell_premium';

    return await this.sendFromTemplate(
      templateName,
      email,
      {
        restaurant_name: restaurantName,
        upgrade_link: upgradeLink
      },
      {
        toName: restaurantName,
        restaurantId
      }
    );
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

  static async startVerificationSequence(restaurantId: string): Promise<void> {
    try {
      console.log('[EmailService] Starting verification sequence for:', restaurantId);

      const { data: restaurant } = await supabase
        .from('restaurants')
        .select('name, email, city')
        .eq('id', restaurantId)
        .maybeSingle();

      console.log('[EmailService] Restaurant data:', restaurant);

      if (!restaurant || !restaurant.email) {
        console.warn('[EmailService] Restaurant not found or no email:', restaurantId);
        return;
      }

      console.log('[EmailService] Sending verification email to:', restaurant.email);

      const emailSent = await this.sendRestaurantVerification(
        restaurantId,
        restaurant.name,
        restaurant.email,
        restaurant.city
      );

      console.log('[EmailService] Email sent result:', emailSent);

      const nextEmailDate = new Date();
      nextEmailDate.setDate(nextEmailDate.getDate() + 3);

      const { error: sequenceError } = await supabase.from('email_sequences').insert([{
        restaurant_id: restaurantId,
        sequence_type: 'claim_reminder',
        current_step: 0,
        total_steps: 3,
        status: 'active',
        last_email_sent_at: new Date().toISOString(),
        next_email_scheduled_at: nextEmailDate.toISOString()
      }]);

      if (sequenceError) {
        console.error('[EmailService] Error creating email sequence:', sequenceError);
      } else {
        console.log('[EmailService] Email sequence created successfully');
      }
    } catch (error) {
      console.error('[EmailService] Error starting verification sequence:', error);
      throw error;
    }
  }

  static async startUpsellSequence(restaurantId: string): Promise<void> {
    try {
      const nextEmailDate = new Date();
      nextEmailDate.setDate(nextEmailDate.getDate() + 3);

      await supabase.from('email_sequences').insert([{
        restaurant_id: restaurantId,
        sequence_type: 'upsell',
        current_step: 0,
        total_steps: 2,
        status: 'active',
        next_email_scheduled_at: nextEmailDate.toISOString()
      }]);
    } catch (error) {
      console.error('Error starting upsell sequence:', error);
    }
  }

  static async processScheduledEmails(): Promise<void> {
    try {
      const { data: sequences } = await supabase
        .from('email_sequences')
        .select('*, restaurants(name, email)')
        .eq('status', 'active')
        .lte('next_email_scheduled_at', new Date().toISOString());

      if (!sequences || sequences.length === 0) return;

      for (const sequence of sequences) {
        const restaurant = sequence.restaurants;
        if (!restaurant || !restaurant.email) continue;

        let success = false;

        if (sequence.sequence_type === 'upsell') {
          const tier = sequence.current_step === 0 ? 'featured' : 'premium';
          success = await this.sendUpsellEmail(
            sequence.restaurant_id,
            restaurant.name,
            restaurant.email,
            tier
          );
        }

        if (success) {
          const nextStep = sequence.current_step + 1;
          const isComplete = nextStep >= sequence.total_steps;

          if (isComplete) {
            await supabase
              .from('email_sequences')
              .update({
                current_step: nextStep,
                status: 'completed',
                last_email_sent_at: new Date().toISOString()
              })
              .eq('id', sequence.id);
          } else {
            const nextEmailDate = new Date();
            nextEmailDate.setDate(nextEmailDate.getDate() + 7);

            await supabase
              .from('email_sequences')
              .update({
                current_step: nextStep,
                last_email_sent_at: new Date().toISOString(),
                next_email_scheduled_at: nextEmailDate.toISOString()
              })
              .eq('id', sequence.id);
          }
        }
      }
    } catch (error) {
      console.error('Error processing scheduled emails:', error);
    }
  }
}
