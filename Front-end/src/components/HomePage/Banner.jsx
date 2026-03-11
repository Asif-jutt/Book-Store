import React, { useState } from "react";
import { Link } from "react-router-dom";
import bannerimage from "../../../public/book1-removebg-preview.png";

function Banner() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary/5 dark:from-slate-900 dark:via-slate-900 dark:to-primary/10">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1 space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full">
              <span className="animate-pulse w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm font-medium text-primary">
                New books added weekly!
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
              Unlock Your <br />
              <span className="bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent">
                Learning Potential
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0">
              Discover our curated collection of books on programming, design,
              and technology. From beginner guides to advanced topics — we've
              got you covered.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8">
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">
                  20+
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Quality Books
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">
                  5
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Free Resources
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">
                  10k+
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Happy Learners
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/books"
                className="px-8 py-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 text-center"
              >
                Browse All Books
              </Link>
              <Link
                to="/books?filter=free"
                className="px-8 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white font-semibold rounded-xl hover:border-primary hover:text-primary dark:hover:text-primary transition-all duration-300 text-center"
              >
                Start Free
              </Link>
            </div>

            {/* Newsletter */}
            <div className="pt-4">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                Get notified when new books are released
              </p>
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0"
              >
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-5 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                >
                  Subscribe
                </button>
              </form>
              {subscribed && (
                <p className="mt-3 text-sm text-green-500 font-medium animate-fade-in">
                  ✓ Thanks for subscribing! Check your inbox soon.
                </p>
              )}
            </div>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative z-10">
              <img
                src={bannerimage}
                alt="Collection of educational books"
                className="w-full max-w-lg mx-auto drop-shadow-2xl animate-float"
              />
            </div>

            {/* Floating elements */}
            <div className="absolute top-10 left-10 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-xl animate-bounce-slow hidden md:flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-2xl">
                📚
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-white">
                  Free Books
                </p>
                <p className="text-sm text-green-500">5 Available</p>
              </div>
            </div>

            <div className="absolute bottom-20 right-5 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-xl animate-bounce-slow-delay hidden md:flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center text-2xl">
                ⭐
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-white">
                  Top Rated
                </p>
                <p className="text-sm text-yellow-500">4.9 Average</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-bounce-slow-delay {
          animation: bounce-slow 3s ease-in-out infinite 1.5s;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}

export default Banner;
