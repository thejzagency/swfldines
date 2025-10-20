import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

      <div className="prose max-w-none space-y-6 text-gray-600">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
          <p>
            We collect information you provide directly to us when you create an account,
            claim a restaurant listing, or contact us. This may include your name, email address,
            and restaurant information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services,
            to communicate with you, and to protect SW Florida Dines and our users.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information Sharing</h2>
          <p>
            We do not sell or share your personal information with third parties except as
            described in this privacy policy. We may share information with service providers
            who help us operate our platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
          <p>
            We take reasonable measures to help protect your personal information from loss,
            theft, misuse, unauthorized access, disclosure, alteration, and destruction.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at
            privacy@swfldines.com.
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-8">
          Last updated: March 2024
        </p>
      </div>
    </div>
  );
}
