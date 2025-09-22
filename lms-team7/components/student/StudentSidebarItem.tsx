import Link from "next/link";
import { usePathname } from "next/navigation";

interface StudentSidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}

export const StudentSidebarItem = ({ href, icon, label, collapsed }: StudentSidebarItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 p-3 rounded-lg transition-colors group ${
        isActive
          ? "bg-blue-100 text-blue-700 font-medium"
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <div className={`flex-shrink-0 ${isActive ? 'text-blue-700' : 'text-gray-500 group-hover:text-gray-700'}`}>
        {icon}
      </div>
      {!collapsed && (
        <span className="text-sm font-medium truncate">{label}</span>
      )}
    </Link>
  );
};