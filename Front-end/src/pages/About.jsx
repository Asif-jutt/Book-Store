import React from "react";
import Navbar from "../components/HomePage/Navbar";
import Footer from "../components/HomePage/Footer";

function About() {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      bio: "Passionate about making education accessible to everyone.",
    },
    {
      name: "Michael Chen",
      role: "Chief Technology Officer",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      bio: "Building the future of online learning, one feature at a time.",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Content",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      bio: "Curating the best educational content from around the world.",
    },
    {
      name: "David Kim",
      role: "Customer Success Lead",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      bio: "Ensuring every learner has the best experience possible.",
    },
  ];

  const stats = [
    { value: "10K+", label: "Happy Students" },
    { value: "500+", label: "Books & Courses" },
    { value: "50+", label: "Expert Authors" },
    { value: "4.9", label: "Average Rating" },
  ];

  return (
    <div className="dark:bg-slate-900 dark:text-white min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">About Our Bookstore</h1>
          <p className="text-xl max-w-3xl mx-auto">
            We're on a mission to make quality education accessible to everyone,
            everywhere. Our curated collection of books and courses helps
            learners achieve their goals.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-base-200 dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-300 mt-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>

            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Founded in 2020, our bookstore started with a simple idea:
                everyone deserves access to quality educational content. What
                began as a small collection of free programming books has grown
                into a comprehensive learning platform serving thousands of
                students worldwide.
              </p>

              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                We believe that learning should be accessible, engaging, and
                effective. That's why we've partnered with industry experts and
                educators to bring you carefully curated content that helps you
                master new skills and advance your career.
              </p>

              <p className="text-lg text-gray-600 dark:text-gray-300">
                Whether you're a beginner taking your first steps or an
                experienced professional looking to stay ahead, we have
                something for you. Join our community of learners today and
                start your journey to success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-base-200 dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="card bg-base-100 dark:bg-slate-700 shadow-xl">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="card-title justify-center">Quality First</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We carefully review every book and course to ensure it meets
                  our high standards for educational value.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 dark:bg-slate-700 shadow-xl">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="card-title justify-center">Accessibility</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Education should be available to everyone. We offer free
                  resources and affordable pricing for premium content.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 dark:bg-slate-700 shadow-xl">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">💡</div>
                <h3 className="card-title justify-center">Innovation</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We continuously improve our platform to provide the best
                  learning experience with modern features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Meet Our Team
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="card bg-base-100 dark:bg-slate-800 shadow-xl"
              >
                <figure className="px-10 pt-10">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="rounded-full w-32 h-32 bg-gray-200"
                  />
                </figure>
                <div className="card-body items-center text-center">
                  <h3 className="card-title">{member.name}</h3>
                  <p className="text-primary font-medium">{member.role}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are already advancing their careers
            with our curated collection of books and courses.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/books" className="btn btn-white btn-lg">
              Browse Books
            </a>
            <a href="/signup" className="btn btn-outline btn-white btn-lg">
              Create Account
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default About;
