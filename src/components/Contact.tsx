import React, { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { MetaTags } from './MetaTags';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <>
      <MetaTags
        title="Contact Us - SW Florida Dines | Get In Touch"
        description="Have questions about SW Florida Dines? Contact us for restaurant listing inquiries, business partnerships, or general questions about dining in Southwest Florida."
        url="https://www.swfldines.com/contact"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600">
          Have questions? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                required
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
            >
              Send Message
            </button>
          </form>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-blue-600 mr-3 mt-1" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-600">info@swfldines.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-blue-600 mr-3 mt-1" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-gray-600">Southwest Florida</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2">Restaurant Owners</h3>
            <p className="text-gray-600 mb-4">
              Want to claim your restaurant listing or add your business to our directory?
            </p>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Learn More →
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
