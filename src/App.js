import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { UserManagement } from './components/UserManagement';
import { RoleManagement } from './components/RoleManagement';
import { Dashboard } from './components/Dashboard';
import { Shield, Users, LayoutDashboard, Menu, X } from 'lucide-react';

const NavLink = ({ to, children, icon: Icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-2.5 rounded-xl text-sm transition-all duration-300 ease-in-out ${
        isActive 
          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25 transform scale-105' 
          : 'text-gray-600 hover:bg-blue-50 hover:text-blue-500 hover:shadow-md'
      }`}
    >
      <Icon className={`w-5 h-5 mr-2 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
      <span className="font-medium">{children}</span>
    </Link>
  );
};

const App = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-pink-400/10 rounded-full blur-2xl animate-bounce" />
          <div className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-blue-400/10 rounded-full blur-2xl animate-bounce delay-700" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-indigo-400/10 rounded-full blur-2xl animate-pulse delay-1000" />
        </div>

        <nav className="relative">
          {/* Gradient border at the bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
          
          <div className="bg-white/80 backdrop-blur-xl shadow-lg">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0 flex items-center group cursor-pointer">
                    <div className="relative">
                      <Shield className="h-8 w-8 text-blue-500 transition-transform duration-300 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg scale-150 animate-pulse" />
                    </div>
                    <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 bg-clip-text text-transparent bg-size-200 animate-gradient">
                      RoleGuard
                    </span>
                  </div>

                  <div className="hidden md:flex md:ml-8 md:space-x-4">
                    <NavLink to="/" icon={LayoutDashboard}>Dashboard</NavLink>
                    <NavLink to="/users" icon={Users}>Users</NavLink>
                    <NavLink to="/roles" icon={Shield}>Roles</NavLink>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="hidden md:flex items-center space-x-2">
                    <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105">
                      Get Started
                    </button>
                  </div>

                  <div className="flex items-center md:hidden">
                    <button
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                      className="p-2 rounded-xl text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    >
                      {isMobileMenuOpen ? (
                        <X className="h-6 w-6" />
                      ) : (
                        <Menu className="h-6 w-6" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile menu with smooth transition */}
            <div 
              className={`md:hidden transition-all duration-300 ease-in-out ${
                isMobileMenuOpen 
                  ? 'max-h-screen opacity-100' 
                  : 'max-h-0 opacity-0 overflow-hidden'
              }`}
            >
              <div className="px-4 py-2 space-y-2 bg-white/50 backdrop-blur-lg">
                <NavLink to="/" icon={LayoutDashboard}>Dashboard</NavLink>
                <NavLink to="/users" icon={Users}>Users</NavLink>
                <NavLink to="/roles" icon={Shield}>Roles</NavLink>
                <button className="w-full mt-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 px-6 relative">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/roles" element={<RoleManagement />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;