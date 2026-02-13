import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-14 xl:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <img src={assets.logo} alt="Logo" className="h-10 brightness-0 invert" />
            <p className="text-sm leading-relaxed text-gray-400">
              Your trusted partner for vehicle rentals across Sri Lanka. Quality service, competitive rates.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-indigo-600 flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-pink-600 flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-500 flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-700 flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-2.5">
              <li><Link to="/" className="hover:text-indigo-400 transition-colors text-sm">Home</Link></li>
              <li><Link to="/cars" className="hover:text-indigo-400 transition-colors text-sm">Browse Cars</Link></li>
              <li><Link to="/post" className="hover:text-indigo-400 transition-colors text-sm">List Your Vehicle</Link></li>
              <li><Link to="/my-bookings" className="hover:text-indigo-400 transition-colors text-sm">My Bookings</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-white mb-4 text-lg">Support</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="hover:text-indigo-400 transition-colors text-sm">Help Center</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors text-sm">Terms of Service</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors text-sm">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-4 text-lg">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-indigo-400 shrink-0" />
                <span>123 Main Street, Colombo, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>+94 11 234 5678</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>info@carrental.lk</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} CarRental. All rights reserved now.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;