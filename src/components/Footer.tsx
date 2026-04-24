import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import Logo from "../assest/logoA.png";

const Footer = () => {
  const socialIcons = [
    { icon: <FaFacebookF />, name: "Facebook", link: "https://www.facebook.com/yourpage" },
    { icon: <FaInstagram />, name: "Instagram", link: "https://www.instagram.com/kawaiworld15" },
    { icon: <FaLinkedinIn />, name: "LinkedIn", link: "https://www.linkedin.com/in/yourprofile" },
    { icon: <FaWhatsapp />, name: "WhatsApp", link: "https://wa.me/your-number" },
  ];

  return (
    <footer className="bg-[#fce7f3] py-16 text-[#555]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 lg:gap-24">
          
          {/* Brand & Social */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <img src={Logo} alt="Logo" className="w-12 h-12" />
              <span className="text-3xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent italic">
                Kawai World
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Making childhood magical with safe, fun, and educational products
              that inspire creativity and learning.
            </p>
            <div className="flex space-x-3">
              {socialIcons.map(({ icon, name, link }, i) => (
                <a
                  key={i}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#DCE4FF] rounded-full flex items-center justify-center text-sm text-[#333] hover:scale-110 transition-transform shadow-sm"
                  aria-label={name}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="font-bold text-gray-900 text-lg">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/return-policy" className="hover:text-pink-500 transition-colors">Shipping & Return Policy</Link></li>
              <li><Link to="/terms&use" className="hover:text-pink-500 transition-colors">Terms Of Use</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-pink-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/disclaimer" className="hover:text-pink-500 transition-colors">Disclaimer</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-pink-500 transition-colors">Shipping Policy</Link></li>
            </ul>
          </div>

          {/* Office Address & Map */}
          <div className="space-y-6">
            <h4 className="font-bold text-gray-900 text-lg">Office Address</h4>
            <p className="text-sm leading-relaxed">
              Kawai World, Shop No.-6, ML-2, Gaur Empire Complex, <br />
              Sector-11, Vasundhara, Ghaziabad - 201012 <br />
              (Kisan Chowk, Near Haldiram)
            </p>
            
            {/* Map Container */}
            <div className="rounded-2xl overflow-hidden shadow-lg border border-white/50 w-full h-40">
              <iframe
                title="Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.077227183061!2d77.3758!3d28.6585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cf00000000001%3A0x0!2zMjjCsDM5JzMwLjYiTiA3N8KwMjInMzIuOSJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-16 pt-8 text-center text-sm">
          <p>
            &copy; 2025 Kawai World. Made with <span className="text-pink-500">💖</span> for amazing kids and parents.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
