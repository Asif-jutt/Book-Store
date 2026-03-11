import React from "react";
import Navbar from "../components/HomePage/Navbar";
import Banner from "../components/HomePage/Banner";
import Footer from "../components/HomePage/Footer";
import Freebook from "../components/HomePage/Freebook";
import FeaturedBooks from "../components/HomePage/FeaturedBooks";
import Features from "../components/HomePage/Features";

function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main id="main-content" className="flex-1">
        <Banner />
        <Features />
        <Freebook />
        <FeaturedBooks />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
