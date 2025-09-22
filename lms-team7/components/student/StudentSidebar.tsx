import { useState } from "react";
import { Home, BookOpen, UserPlus, Menu, X } from "lucide-react";
import { StudentSidebarItem } from "./StudentSidebarItem";

interface StudentSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const StudentSidebar = ({ collapsed, onToggle }: StudentSidebarProps) => {
  const sidebarItems = [
    {
      href: "/student",
      icon: <Home size={20} />,
      label: "Dashboard"
    },
    {
      href: "/student/courses",
      icon: <BookOpen size={20} />,
      label: "My Courses"
    },
    {
      href: "/student/enrol",
      icon: <UserPlus size={20} />,
      label: "Enroll"
    }
  ];

  return (
    <div className={`${
      collapsed ? "w-20" : "w-64"
    } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <h2 className="text-lg font-semibold text-gray-900">Student Portal</h2>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {sidebarItems.map((item) => (
            <StudentSidebarItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              collapsed={collapsed}
            />
          ))}
        </div>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            Learning Management System
          </div>
        </div>
      )}
    </div>
  );
};