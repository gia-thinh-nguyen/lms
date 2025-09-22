import React from "react";
import Link from "next/link";

function TeacherSidebarItem({ href, icon: Icon, label }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-green-100 transition-colors">
      <Icon className="h-6 w-6 text-green-600" />
      <span className="text-base font-medium text-gray-800">{label}</span>
    </Link>
  );
}

export default TeacherSidebarItem;
