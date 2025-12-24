
import React from 'react';
import { Phone, MessageCircle, Mail, MapPin } from 'lucide-react';
import { BUSINESS_PHONE, WHATSAPP_LINK } from '../constants';

const Contact: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Let's build something together.</h1>
          <p className="text-lg text-gray-500 mb-10">Have a large project? We provide custom site-wise contracts for ongoing construction. Reach out to our project desk.</p>
          
          <div className="space-y-6">
            <a href={`tel:${BUSINESS_PHONE}`} className="flex items-center gap-4 p-6 bg-white border rounded-2xl hover:border-orange-200 hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <Phone size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Call Support</p>
                <p className="text-xl font-bold text-gray-900">{BUSINESS_PHONE}</p>
              </div>
            </a>

            <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-6 bg-white border rounded-2xl hover:border-green-200 hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <MessageCircle size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">WhatsApp Quote</p>
                <p className="text-xl font-bold text-gray-900">Send Requirements</p>
              </div>
            </a>

            <div className="flex items-center gap-4 p-6 bg-white border rounded-2xl">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Registered Office</p>
                <p className="text-lg font-bold text-gray-900">Baner-Pashan Link Road, Pune, Maharashtra.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 p-10 rounded-[3rem] text-white">
          <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Subject</label>
              <select className="w-full bg-gray-800 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500">
                <option>New Material Quote</option>
                <option>Supplier Partnership</option>
                <option>Logistics Inquiry</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Your Details</label>
              <input type="text" placeholder="Name or Company" className="w-full bg-gray-800 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 mb-3" />
              <input type="tel" placeholder="Mobile Number" className="w-full bg-gray-800 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Message</label>
              <textarea placeholder="How can we help?" className="w-full bg-gray-800 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 h-32 resize-none"></textarea>
            </div>
            <button className="w-full bg-orange-600 py-4 rounded-xl font-bold hover:bg-orange-700 transition-colors">Submit Request</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
