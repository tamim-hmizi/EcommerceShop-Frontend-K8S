import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";
import ThemeToggle from "../ThemeToggle";
import { useState } from "react";
import {
  FiHome,
  FiUsers,
  FiPackage,
  FiGrid,
  FiShoppingCart,
  FiLogOut,
  FiMenu,
  FiX
} from "react-icons/fi";

function AdminSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/signin");
  };

  // Current path for active link styling
  const currentPath = location.pathname;

  // Navigation items with consistent icons
  const navigationItems = [
    {
      path: "/admin/",
      name: "Dashboard",
      icon: FiHome,
    },
    {
      path: "/admin/user",
      name: "Users",
      icon: FiUsers,
    },
    {
      path: "/admin/product",
      name: "Products",
      icon: FiPackage,
    },
    {
      path: "/admin/category",
      name: "Categories",
      icon: FiGrid,
    },
    {
      path: "/admin/order",
      name: "Orders",
      icon: FiShoppingCart,
    },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`admin-sidebar flex flex-col justify-between h-screen transition-all duration-300 ease-in-out ${
      isCollapsed ? 'w-16' : 'w-20 lg:w-64'
    } p-4`}>
      {/* Logo and Navigation */}
      <div>
        {/* Header with logo and collapse button */}
        <div className="mb-8 flex items-center justify-between">
          <Link to="/admin" className="flex items-center group">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
              <img
                src="/logo.png"
                alt="shop logo"
                className="w-8 h-8 transition-all duration-300"
              />
            </div>
            {!isCollapsed && (
              <span className="hidden lg:inline-block ml-3 text-lg font-bold text-primary">
                Admin Panel
              </span>
            )}
          </Link>

          {/* Collapse button for larger screens */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex p-2 rounded-lg hover:bg-base-300 transition-colors duration-200"
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? <FiMenu className="w-4 h-4" /> : <FiX className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentPath === item.path ||
              (item.path === "/admin/" && currentPath === "/admin");

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-nav-item flex items-center py-3 px-4 group ${
                  isActive ? 'active' : ''
                }`}
                title={isCollapsed ? item.name : ''}
              >
                <div className="flex items-center justify-center w-6 h-6">
                  <IconComponent className="w-5 h-5" />
                </div>
                {!isCollapsed && (
                  <span className="hidden lg:inline ml-3 font-medium">
                    {item.name}
                  </span>
                )}

                {/* Active indicator */}
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full opacity-80"></div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="space-y-4">
        {/* Theme Toggle */}
        <div className="border-t border-base-300 pt-4">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-center lg:justify-between'}`}>
            {!isCollapsed && (
              <span className="hidden lg:inline text-sm font-medium text-base-content/70">
                Theme
              </span>
            )}
            <ThemeToggle variant="button" size="sm" />
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`btn btn-outline btn-error w-full group transition-all duration-200 ${
            isCollapsed ? 'btn-square' : ''
          }`}
          title={isCollapsed ? 'Logout' : ''}
        >
          <FiLogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
          {!isCollapsed && (
            <span className="hidden lg:inline ml-2">Logout</span>
          )}
        </button>
      </div>
    </div>
  );
}

export default AdminSidebar;
