"use client";
import { useState } from "react";
import { StudentSidebar } from "@/components/student/StudentSidebar";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <StudentSidebar 
        collapsed={sidebarCollapsed} 
        onToggle={handleSidebarToggle} 
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Top header */}
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Student Portal</h1>
            <p className="text-sm text-gray-600">Learning Management System</p>
          </div>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
