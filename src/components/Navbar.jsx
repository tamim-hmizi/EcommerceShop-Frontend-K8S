import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";
import CartDropdown from "./CartDropdown";
import ThemeToggle from "./ThemeToggle";
import Avatar from "./Avatar";
import { useState, useEffect } from "react";
import {
  FiUser,
  FiLogOut,
  FiShoppingBag,
  FiHome,
  FiMail,
  FiMenu,
  FiX,
  FiShoppingCart,
  FiHeart,
} from "react-icons/fi";

function Navbar() {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Check if the current path matches the link
  const isActive = path => {
    return location.pathname === path;
  };

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(
    () => {
      setMobileMenuOpen(false);
    },
    [location]
  );

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/signin");
  };

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${scrolled
        ? "bg-base-100/95 shadow-md"
        : "bg-base-100/90 border-base-300 shadow-sm"}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="relative">
              <FiShoppingCart className="w-7 h-7 text-primary mr-2 transition-transform duration-300 group-hover:scale-110" />
              <span className="absolute -top-1 -right-1 bg-secondary text-secondary-content text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                {user ? "!" : "0"}
              </span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent transition-all duration-300 group-hover:from-secondary group-hover:to-primary">
              LuxeCart
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {[
              {
                path: "/",
                label: "Home",
                icon: <FiHome className="w-4 h-4" />,
              },
              {
                path: "/product",
                label: "Products",
                icon: <FiShoppingBag className="w-4 h-4" />,
              },
              {
                path: "/contact",
                label: "Contact",
                icon: <FiMail className="w-4 h-4" />,
              },
            ].map(item =>
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors relative group flex items-center gap-1.5 py-1 ${isActive(
                  item.path
                )
                  ? "text-primary"
                  : "text-base-content/70 hover:text-primary"}`}
              >
                {item.icon}
                {item.label}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${isActive(
                    item.path
                  )
                    ? "w-full"
                    : "w-0 group-hover:w-full"}`}
                />
              </Link>
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {user && <CartDropdown />}

            {/* Theme Toggle */}
            <ThemeToggle variant="button" size="md" />

            {user
              ? <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <Avatar
                      src={user.profilePicture}
                      alt={user.name}
                      size="md"
                      fallbackText={user.name}
                      className="ring-2 ring-primary/20 ring-offset-2 shadow-sm"
                    />
                    <span className="hidden md:inline text-sm font-medium text-base-content">
                      {user.name}
                    </span>
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-lg w-56 border border-base-300 mt-2 animate-slideInUp"
                  >
                    <li>
                      <Link to="/profile" className="text-sm hover:bg-base-200">
                        <FiUser className="w-4 h-4" />
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/favorites"
                        className="text-sm hover:bg-base-200"
                      >
                        <FiHeart className="w-4 h-4" />
                        My Favorites
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/my-orders"
                        className="text-sm hover:bg-base-200"
                      >
                        <FiShoppingBag className="w-4 h-4" />
                        My Orders
                      </Link>
                    </li>
                    <li className="border-t border-base-300 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="text-sm text-error hover:bg-error/10"
                      >
                        <FiLogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              : <Link
                  to="/signin"
                  className="btn btn-ghost btn-circle hover:bg-base-200 transition-colors"
                  title="Sign In"
                >
                  <FiUser className="w-5 h-5 text-base-content" />
                </Link>}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn btn-ghost btn-circle md:hidden"
            >
              {mobileMenuOpen
                ? <FiX className="w-5 h-5" />
                : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen &&
          <div className="md:hidden py-3 px-2 border-t border-base-300 animate-fadeIn">
            <nav className="flex flex-col space-y-2">
              {[
                {
                  path: "/",
                  label: "Home",
                  icon: <FiHome className="w-4 h-4" />,
                },
                {
                  path: "/product",
                  label: "Products",
                  icon: <FiShoppingBag className="w-4 h-4" />,
                },
                {
                  path: "/contact",
                  label: "Contact",
                  icon: <FiMail className="w-4 h-4" />,
                },
                ...(user
                  ? [
                      {
                        path: "/favorites",
                        label: "My Favorites",
                        icon: <FiHeart className="w-4 h-4" />,
                      },
                      {
                        path: "/my-orders",
                        label: "My Orders",
                        icon: <FiShoppingBag className="w-4 h-4" />,
                      },
                      {
                        path: "/profile",
                        label: "Profile",
                        icon: <FiUser className="w-4 h-4" />,
                      },
                    ]
                  : []),
              ].map(item =>
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 p-2 rounded-md ${isActive(
                    item.path
                  )
                    ? "bg-primary/10 text-primary"
                    : "text-base-content/70 hover:bg-base-200"}`}
                >
                  {item.icon}
                  <span className="text-sm font-medium">
                    {item.label}
                  </span>
                </Link>
              )}
            </nav>

            {/* Sign In Button for Mobile (when not authenticated) */}
            {!user && (
              <div className="border-t border-base-300 pt-3 mt-3">
                <Link
                  to="/signin"
                  className="btn btn-primary w-full gap-2 shadow-md hover:shadow-lg transition-all duration-300 font-semibold"
                >
                  <FiUser className="w-4 h-4" />
                  Sign In
                </Link>
              </div>
            )}

            {/* Logout Button for Mobile (when authenticated) */}
            {user && (
              <div className="border-t border-base-300 pt-3 mt-3">
                <button
                  onClick={handleLogout}
                  className="btn btn-outline btn-error w-full gap-2 hover:btn-error transition-all duration-300"
                >
                  <FiLogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}

            {/* Theme Toggle for Mobile */}
            <div className="border-t border-base-300 pt-3 mt-3">
              <div className="flex items-center justify-between px-2">
                <span className="text-sm font-medium text-base-content/70">
                  Theme
                </span>
                <ThemeToggle variant="toggle" size="sm" />
              </div>
            </div>
          </div>}
      </div>
    </header>
  );
}

export default Navbar;
