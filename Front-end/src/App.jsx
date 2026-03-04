import React from "react";
import Home from "./Home/Home.jsx";
import "./index.css";
import Course from "./Course/Course.jsx";
import { Routes, Route } from "react-router-dom";
import Signup from "./components/HomePage/Signup.jsx";
function App() {
  return (
    <>
      <div className="dark:bg-slate-900 dark:text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/course" element={<Course />} />
          <Route path="/signup" element={<Signup/>}/>
        </Routes>
      </div>
    </>
  );
}

export default App;
