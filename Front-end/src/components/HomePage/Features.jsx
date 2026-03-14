import React from "react";

function Features() {
  const features = [
    {
      icon: "📚",
      title: "Curated Library",
      description:
        "Hand-picked collection of the best programming and tech books, constantly updated with new releases.",
      color: "bg-blue-500",
    },
    {
      icon: "🆓",
      title: "Free Resources",
      description:
        "Start your learning journey with our completely free books. No hidden costs, no credit card required.",
      color: "bg-green-500",
    },
    {
      icon: "🎓",
      title: "Expert Authors",
      description:
        "Learn from industry professionals with real-world experience in software development and design.",
      color: "bg-purple-500",
    },
    {
      icon: "📱",
      title: "Read Anywhere",
      description:
        "Access your books on any device. Our reader is fully responsive and works offline.",
      color: "bg-orange-500",
    },
    {
      icon: "⚡",
      title: "Instant Access",
      description:
        "Start reading immediately after purchase. No waiting, no downloads needed.",
      color: "bg-pink-500",
    },
    {
      icon: "🔄",
      title: "Lifetime Updates",
      description:
        "Once purchased, get all future updates to your books absolutely free.",
      color: "bg-cyan-500",
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="px-4 py-2 bg-primary/10 text-primary font-medium rounded-full text-sm">
            Why Choose Us
          </span>
          <h2 className="mt-6 text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            Everything You Need to <br className="hidden md:block" />
            <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              Level Up Your Skills
            </span>
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            We've built the ultimate platform for developers and designers who
            want to learn, grow, and succeed in tech.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-white dark:hover:bg-slate-700 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg mb-6 group-hover:scale-110 transition-transform`}
              >
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {feature.description}
              </p>

              {/* Decorative gradient */}
              <div
                className={`absolute top-0 right-0 w-32 h-32 ${feature.color} opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity`}
              />
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 p-8 bg-linear-to-r from-primary/5 via-purple-500/5 to-secondary/5 rounded-3xl border border-slate-200 dark:border-slate-700">
          {[
            { value: "20+", label: "Quality Books" },
            { value: "10k+", label: "Happy Learners" },
            { value: "4.9★", label: "Average Rating" },
            { value: "24/7", label: "Access Time" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
