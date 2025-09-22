import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const publicLinks = [{ name: "Home", path: "/" }];
  const protectedLinks = [
    { name: "Features", path: "/features" },
    { name: "Explore", path: "/explore" },
    { name: "Contact", path: "/contact" },
  ];

  const navLinks = user ? [...publicLinks, ...protectedLinks] : publicLinks;

  return (
    <nav className="bg-gradient-to-r from-green-600 to-green-800 text-white px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-lg">
      {/* Logo */}
      <div className="flex items-center space-x-2 text-2xl font-extrabold tracking-wider drop-shadow-md">
        <span className="text-yellow-300">🌱</span>
        <span className="hover:scale-105 transition-transform">AgriAI</span>
      </div>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex space-x-6 font-medium items-center">
        {navLinks.map((link, index) => (
          <li key={index}>
            <Link
              to={link.path}
              className={`relative px-3 py-2 transition duration-300 ${
                location.pathname === link.path
                  ? "text-yellow-300 font-semibold"
                  : "hover:text-yellow-300"
              }`}
            >
              {link.name}
            </Link>
          </li>
        ))}

        {/* Show Logout if user is logged in */}
        {user && (
          <li>
            <button
              onClick={logout}
              className="flex items-center px-3 py-2 hover:text-yellow-300 transition duration-300"
            >
              <LogOut size={18} className="mr-1" /> Logout
            </button>
          </li>
        )}
      </ul>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Dropdown */}
      {isOpen && (
        <ul className="absolute top-16 left-0 w-full bg-green-800 text-white flex flex-col items-center space-y-4 py-6 md:hidden shadow-lg">
          {navLinks.map((link, index) => (
            <li key={index}>
              <Link
                to={link.path}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  location.pathname === link.path
                    ? "bg-green-700 text-yellow-300 font-semibold"
                    : "hover:bg-green-600 hover:text-yellow-300"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            </li>
          ))}

          {user && (
            <li>
              <button
                onClick={logout}
                className="flex items-center px-4 py-2 rounded-lg hover:bg-green-600 hover:text-yellow-300 transition duration-300"
              >
                <LogOut size={18} className="mr-1" /> Logout
              </button>
            </li>
          )}
        </ul>
      )}
    </nav>
  );
}

export default Header;
