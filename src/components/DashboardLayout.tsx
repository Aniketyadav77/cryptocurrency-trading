
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { 
  ChartLine, 
  Wallet, 
  LogOut, 
  Bitcoin, 
  BarChart3, 
  User, 
  Bell 
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: <ChartLine className="h-5 w-5" /> },
    { name: "Market", href: "/market", icon: <BarChart3 className="h-5 w-5" /> },
    { name: "Trade", href: "/trade", icon: <Bitcoin className="h-5 w-5" /> },
    { name: "Wallet", href: "/wallet", icon: <Wallet className="h-5 w-5" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow bg-crypto-bg-dark border-r border-gray-800">
          <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-800">
            <h1 className="text-xl font-semibold text-white">
              <span className="text-primary">Crypto</span>Horizon
            </h1>
          </div>
          <div className="flex-grow flex flex-col justify-between overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive(item.href)
                      ? "bg-crypto-bg-card text-primary"
                      : "text-gray-300 hover:bg-crypto-bg-card hover:text-primary"
                  } group flex items-center px-2 py-3 text-sm font-medium rounded-md transition-colors`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              ))}
            </nav>
            {user && (
              <div className="flex-shrink-0 flex border-t border-gray-800 p-4">
                <div className="flex items-center">
                  <div>
                    <img
                      className="inline-block h-9 w-9 rounded-full"
                      src={user.profileImage}
                      alt=""
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <button
                      onClick={logout}
                      className="flex items-center text-xs font-medium text-gray-400 hover:text-white transition-colors"
                    >
                      <LogOut className="mr-1 h-3 w-3" />
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="bg-crypto-bg-dark border-b border-gray-800">
          <div className="px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center md:hidden">
                <h1 className="text-xl font-semibold text-white">
                  <span className="text-primary">Crypto</span>Horizon
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-1 text-gray-400 rounded-full hover:text-white">
                  <Bell className="h-5 w-5" />
                </button>
                <button className="p-1 text-gray-400 rounded-full hover:text-white">
                  <User className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-crypto-bg-dark">
          <div className="py-6">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>

        {/* Mobile navigation */}
        <nav className="md:hidden bg-crypto-bg-dark border-t border-gray-800">
          <div className="flex justify-around">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  isActive(item.href) ? "text-primary" : "text-gray-400"
                } flex flex-col items-center py-2`}
              >
                {item.icon}
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default DashboardLayout;
