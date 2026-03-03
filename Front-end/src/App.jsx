import React from "react";
import Home from "./Home/Home.jsx";
import "./index.css";
import Course from "./Course/Course.jsx";
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
      <div className="dark:bg-slate-900 dark:text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/course" element={<Course />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
