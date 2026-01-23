import Link from 'next/link';
import { Heart, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              NGO Marketplace
            </Link>
            <p className="text-sm leading-relaxed">
              Connecting passionate volunteers and generous donors with verified NGOs to create real-world impact.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/campaigns" className="hover:text-emerald-400 transition">Browse Campaigns</Link></li>
              <li><Link href="/register" className="hover:text-emerald-400 transition">Register as NGO</Link></li>
              <li><Link href="/login" className="hover:text-emerald-400 transition">Volunteer Login</Link></li>
              <li><Link href="/admin" className="hover:text-emerald-400 transition">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3"><Mail size={16} /> support@nexusngo.com</li>
              <li className="flex items-center gap-3"><Phone size={16} /> +91 98765 43210</li>
              <li className="flex items-center gap-3"><MapPin size={16} /> Mumbai, India</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold mb-4">Stay Updated</h3>
            <div className="flex gap-2">
              <input 
                placeholder="Enter your email" 
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm w-full focus:border-emerald-500 outline-none"
              />
              <button className="bg-emerald-600 text-white px-3 py-2 rounded-lg hover:bg-emerald-700">
                Go
              </button>
            </div>
            <div className="flex gap-4 mt-6">
              <Facebook className="w-5 h-5 hover:text-white cursor-pointer" />
              <Twitter className="w-5 h-5 hover:text-white cursor-pointer" />
              <Instagram className="w-5 h-5 hover:text-white cursor-pointer" />
              <Linkedin className="w-5 h-5 hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-8 text-center text-xs">
          <p>© 2024 NGO Marketplace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}