import { Link } from "react-router-dom";
import {
  FiShoppingCart,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCreditCard,
  FiTruck,
  FiShield,
  FiHeart,
} from "react-icons/fi";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaPinterest,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-base-300 text-base-content border-t border-base-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <FiShoppingCart className="w-6 h-6 text-primary mr-2" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                LuxeCart
              </span>
            </div>
            <p className="mb-4 text-base-content/70">
              Your one-stop destination for premium products at competitive
              prices. We're committed to providing an exceptional shopping
              experience.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-base-content/60 hover:text-primary transition-colors"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-base-content/60 hover:text-primary transition-colors"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-base-content/60 hover:text-primary transition-colors"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-base-content/60 hover:text-primary transition-colors"
              >
                <FaYoutube className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-base-content/60 hover:text-primary transition-colors"
              >
                <FaPinterest className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base-content font-semibold text-lg mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-base-content/70 hover:text-primary transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-base-content/40 rounded-full" />
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/product"
                  className="text-base-content/70 hover:text-primary transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-base-content/40 rounded-full" />
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-base-content/70 hover:text-primary transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-base-content/40 rounded-full" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/my-orders"
                  className="text-base-content/70 hover:text-primary transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-base-content/40 rounded-full" />
                  My Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/favorites"
                  className="text-base-content/70 hover:text-primary transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-base-content/40 rounded-full" />
                  My Favorites
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-base-content/70 hover:text-primary transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-base-content/40 rounded-full" />
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-base-content font-semibold text-lg mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FiMapPin className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-base-content/70">
                  123 Commerce Street, Shopping District, NY 10001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="w-5 h-5 text-primary" />
                <span className="text-base-content/70">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="w-5 h-5 text-primary" />
                <span className="text-base-content/70">
                  support@luxecart.com
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-base-content font-semibold text-lg mb-4">
              Newsletter
            </h3>
            <p className="text-base-content/70 mb-4">
              Subscribe to our newsletter for the latest products, offers, and
              updates.
            </p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className="input input-bordered"
              />
              <button type="submit" className="btn btn-primary">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Features Bar */}
      <div className="border-t border-base-content/20 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <FiTruck className="w-8 h-8 text-primary mb-2" />
              <h4 className="text-base-content font-medium">Free Shipping</h4>
              <p className="text-base-content/60 text-sm">On orders over $50</p>
            </div>
            <div className="flex flex-col items-center">
              <FiCreditCard className="w-8 h-8 text-primary mb-2" />
              <h4 className="text-base-content font-medium">Secure Payment</h4>
              <p className="text-base-content/60 text-sm">
                100% secure payment
              </p>
            </div>
            <div className="flex flex-col items-center">
              <FiShield className="w-8 h-8 text-primary mb-2" />
              <h4 className="text-base-content font-medium">
                Quality Guarantee
              </h4>
              <p className="text-base-content/60 text-sm">30-day money back</p>
            </div>
            <div className="flex flex-col items-center">
              <FiHeart className="w-8 h-8 text-primary mb-2" />
              <h4 className="text-base-content font-medium">24/7 Support</h4>
              <p className="text-base-content/60 text-sm">Dedicated support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-base-200 py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-base-content/60 text-sm">
            &copy; {new Date().getFullYear()} LuxeCart. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="#"
              className="text-base-content/60 hover:text-base-content/80 text-sm"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-base-content/60 hover:text-base-content/80 text-sm"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-base-content/60 hover:text-base-content/80 text-sm"
            >
              Shipping Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
