import { Link, useLocation } from "wouter";
import { Building, ChartPie, Users, MessageCircle, Home, Handshake, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: ChartPie },
  { name: "Leads", href: "/leads", icon: Users },
  { name: "Chat", href: "/chat", icon: MessageCircle },
  { name: "Imóveis", href: "/properties", icon: Home },
  { name: "Vendas", href: "/sales", icon: Handshake },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [location] = useLocation();

  return (
    <div className={cn(
      "bg-white shadow-lg transition-all duration-300 border-r border-gray-200 flex flex-col",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Building className="text-primary-foreground" size={20} />
          </div>
          {!collapsed && (
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-900">RealEstate</h1>
              <p className="text-sm text-gray-500">CRM Imobiliário</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="absolute top-6 right-6 p-2"
        >
          <Menu className="text-gray-600" size={16} />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6">
        <ul className="space-y-2 px-4">
          {navigation.map((item) => {
            const isActive = location === item.href || (item.href === "/dashboard" && location === "/");
            const Icon = item.icon;
            
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <a className={cn(
                    "nav-item flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                    isActive && "active"
                  )}>
                    <Icon size={20} />
                    {!collapsed && <span className="ml-3">{item.name}</span>}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="text-primary-foreground" size={16} />
          </div>
          {!collapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@realestate.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
