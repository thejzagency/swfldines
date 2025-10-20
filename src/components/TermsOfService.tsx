import React from 'react';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>

      <div className="prose max-w-none space-y-6 text-gray-600">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptance of Terms</h2>
          <p>
            By accessing and using SW Florida Dines, you accept and agree to be bound by the
            terms and provision of this agreement.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Accounts</h2>
          <p>
            When you create an account with us, you must provide accurate, complete, and current
            information. Failure to do so constitutes a breach of the Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Restaurant Listings</h2>
          <p>
            Restaurant owners may claim their listings and provide updated information. You agree
            to provide accurate information about your restaurant and not to misrepresent your
            business in any way.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Prohibited Uses</h2>
          <p>
            You may not use our service for any illegal or unauthorized purpose. You must not
            violate any laws in your jurisdiction.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
          <p>
            SW Florida Dines shall not be liable for any indirect, incidental, special,
            consequential or punitive damages resulting from your use of or inability to use
            the service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
          <p>
            We reserve the right to modify or replace these Terms at any time. We will provide
            notice of any changes by posting the new Terms on this page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at legal@swfldines.com.
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-8">
          Last updated: March 2024
        </p>
      </div>
    </div>
  );
}
