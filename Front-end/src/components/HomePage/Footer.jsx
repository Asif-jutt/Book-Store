import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    explore: [
      { label: "All Books", path: "/books" },
      { label: "Free Books", path: "/books?filter=free" },
      { label: "Courses", path: "/course" },
      { label: "New Releases", path: "/books?sort=newest" },
    ],
    company: [
      { label: "About Us", path: "/about" },
      { label: "Contact", path: "/contact" },
      { label: "Careers", path: "/careers" },
      { label: "Blog", path: "/blog" },
    ],
    support: [
      { label: "Help Center", path: "/help" },
      { label: "FAQ", path: "/faq" },
      { label: "Privacy Policy", path: "/privacy" },
      { label: "Terms of Service", path: "/terms" },
    ],
    social: [
      { label: "Twitter", icon: "𝕏", url: "#" },
      { label: "GitHub", icon: "⬢", url: "#" },
      { label: "LinkedIn", icon: "in", url: "#" },
      { label: "YouTube", icon: "▶", url: "#" },
    ],
  };

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="flex items-center gap-2 text-white text-xl font-bold mb-4"
            >
              <span className="text-2xl">📖</span>
              BookStore
            </Link>
            <p className="text-slate-400 mb-6 max-w-sm">
              Your gateway to knowledge. Discover thousands of books on
              programming, design, technology, and more. Start your learning
              journey today.
            </p>

            {/* Newsletter */}
            <div className="mb-6">
              <h4 className="text-white font-semibold mb-3">Stay Updated</h4>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none text-white placeholder-slate-500"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {footerLinks.social.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-slate-800 hover:bg-primary text-slate-400 hover:text-white rounded-lg transition-colors"
                  aria-label={social.label}
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Explore</h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm text-center md:text-left">
              © {currentYear} BookStore. All rights reserved. Made with ❤️ for
              learners.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link
                to="/privacy"
                className="text-slate-500 hover:text-white transition-colors"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="text-slate-500 hover:text-white transition-colors"
              >
                Terms
              </Link>
              <Link
                to="/cookies"
                className="text-slate-500 hover:text-white transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
