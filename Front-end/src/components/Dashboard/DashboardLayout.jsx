import React from "react";
import { Outlet } from "react-router-dom";
import DashboardNavbar from "./DashboardNavbar";

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-base-200 dark:bg-slate-900">
      <DashboardNavbar />
      <div className="container mx-auto px-4 py-8">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
