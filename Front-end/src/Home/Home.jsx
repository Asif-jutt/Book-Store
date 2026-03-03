import React from "react";
import Navbar from "../components/HomePage/Navbar";
import Banner from "../components/HomePage/Banner";
import Footer from "../components/HomePage/Footer";
import Freebook from "../components/HomePage/Freebook";

function Home() {
  return (
    <>
      <div>
        <Navbar />
        <Banner />
        <Freebook />
        <Footer />
      </div>
    </>
  );
}

export default Home;
