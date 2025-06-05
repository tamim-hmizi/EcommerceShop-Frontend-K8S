import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  FiArrowRight,
  FiShoppingBag,
  FiTruck,
  FiRefreshCw,
  FiHeadphones,
  FiStar,
  FiMonitor,
  FiSmartphone,
  FiClock,
  FiHome,
  FiShoppingCart,
  FiPackage,
  FiCamera,
  FiBookOpen,
  FiTool
} from "react-icons/fi";
import ProductCard from "../components/ProductCard";
import { getCategories } from "../services/categoryService";
import { fetchProducts } from "../redux/slices/productSlice";
import Loading from "../components/Loading";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { products, loading: productsLoading } = useSelector(
    state => state.products
  );
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper function to get the appropriate icon for each category
  const getCategoryIcon = categoryName => {
    const name = categoryName.toLowerCase();
    if (name.includes("electronics") || name.includes("tech")) return FiMonitor;
    if (name.includes("phone") || name.includes("mobile")) return FiSmartphone;
    if (name.includes("watch") || name.includes("wearable")) return FiClock;
    if (name.includes("audio") || name.includes("headphone"))
      return FiHeadphones;
    if (name.includes("home") || name.includes("furniture")) return FiHome;
    if (name.includes("fashion") || name.includes("cloth"))
      return FiShoppingCart;
    if (name.includes("gift") || name.includes("toy")) return FiPackage;
    if (name.includes("camera") || name.includes("photo")) return FiCamera;
    if (name.includes("book") || name.includes("media")) return FiBookOpen;
    return FiTool; // Default icon
  };

  useEffect(
    () => {
      if (user && user.isAdmin) navigate("/admin");
    },
    [user, navigate]
  );

  // Fetch products from Redux store
  useEffect(
    () => {
      if (products.length === 0) {
        dispatch(fetchProducts());
      }
    },
    [dispatch, products.length]
  );

  // Update featured products when products change
  useEffect(
    () => {
      if (products.length > 0) {
        // Get 4 random products as featured
        const shuffled = [...products].sort(() => 0.5 - Math.random());
        setFeaturedProducts(shuffled.slice(0, 4));
      }
    },
    [products]
  );

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const categoriesData = await getCategories();
        setCategories(categoriesData.data || []);
        console.log(
          "Categories loaded:",
          categoriesData.data ? categoriesData.data.length : 0
        );
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading || productsLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary via-secondary to-primary text-primary-content">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary-content/20" />
          <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-primary-content/10" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-primary-content/10" />
        </div>

        <div className="container mx-auto px-6 py-20 md:py-28 flex flex-col md:flex-row items-center relative z-10">
          <div className="md:w-1/2 mb-12 md:mb-0 animate-fadeIn">
            <span className="inline-block px-4 py-1 bg-primary-content/20 backdrop-blur-sm text-primary-content rounded-full font-medium text-sm mb-6">
              Welcome to LuxeCart
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Discover <span className="text-accent">Amazing</span> Products for
              Your Lifestyle
            </h1>
            <p className="text-lg md:text-xl mb-8 text-primary-content/90 max-w-lg">
              Shop the latest trends with confidence. Quality products,
              competitive prices, and exceptional service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/product"
                className="btn bg-primary-content hover:bg-primary-content/90 text-primary border-0 gap-2 shadow-lg hover:shadow-xl transition-all px-8 py-3 rounded-full"
              >
                Shop Now <FiArrowRight className="animate-pulse" />
              </Link>
              <Link
                to="/contact"
                className="btn bg-transparent hover:bg-primary-content/20 text-primary-content border-2 border-primary-content hover:border-primary-content px-8 py-3 rounded-full"
              >
                Learn More
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 mt-10">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary-content/20 flex items-center justify-center">
                  <FiTruck className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary-content/20 flex items-center justify-center">
                  <FiRefreshCw className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">Easy Returns</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary-content/20 flex items-center justify-center">
                  <FiShoppingBag className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">Secure Checkout</span>
              </div>
            </div>
          </div>

          <div className="md:w-1/2 flex justify-center animate-slideInUp">
            <div className="relative">
              <div className="absolute -inset-4 bg-primary-content/20 rounded-full blur-xl" />
              <img
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Shopping Experience"
                className="relative rounded-2xl shadow-2xl max-w-full h-auto border-4 border-primary-content/30"
              />

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 bg-accent text-accent-content font-bold px-4 py-2 rounded-lg shadow-lg transform rotate-6">
                NEW ARRIVALS
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary-content text-primary font-bold px-4 py-2 rounded-lg shadow-lg transform -rotate-3">
                UP TO 50% OFF
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-base-content mb-4">
              Why Shop With Us
            </h2>
            <p className="text-base-content/70 max-w-2xl mx-auto">
              Experience the best online shopping with our premium services and
              customer-focused approach.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-base-100 rounded-xl shadow-md p-8 text-center hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1 border border-base-300">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiTruck className="text-primary w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-base-content">
                Free Shipping
              </h3>
              <p className="text-base-content/70">
                Enjoy free shipping on all orders over $50. Fast delivery to
                your doorstep.
              </p>
            </div>

            <div className="bg-base-100 rounded-xl shadow-md p-8 text-center hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1 border border-base-300">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiRefreshCw className="text-secondary w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-base-content">
                Easy Returns
              </h3>
              <p className="text-base-content/70">
                Not satisfied? Return within 30 days for a full refund, no
                questions asked.
              </p>
            </div>

            <div className="bg-base-100 rounded-xl shadow-md p-8 text-center hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1 border border-base-300">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiHeadphones className="text-accent w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-base-content">
                24/7 Support
              </h3>
              <p className="text-base-content/70">
                Our customer service team is available around the clock to
                assist you.
              </p>
            </div>

            <div className="bg-base-100 rounded-xl shadow-md p-8 text-center hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1 border border-base-300">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiShoppingBag className="text-success w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-base-content">
                Secure Checkout
              </h3>
              <p className="text-base-content/70">
                Shop with confidence with our 100% secure payment processing
                system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                Handpicked for you
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-base-content mt-2">
                Featured Products
              </h2>
            </div>
            <Link
              to="/product"
              className="mt-4 md:mt-0 group flex items-center gap-2 text-primary hover:text-primary-focus font-medium transition-colors"
            >
              View All Products
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product =>
              <div
                key={product._id}
                className="transform transition-transform hover:-translate-y-2 duration-300"
              >
                <ProductCard product={product} />
              </div>
            )}
          </div>

          {/* Featured Banner */}
          <div className="mt-16 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl overflow-hidden shadow-md border border-base-300">
            <div className="grid md:grid-cols-2 items-center">
              <div className="p-8 md:p-12">
                <span className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium mb-4">
                  Featured Collection
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-base-content mb-4">
                  New Arrivals for Summer
                </h3>
                <p className="text-base-content/70 mb-6">
                  Discover our latest collection of summer essentials. Perfect
                  for the season with vibrant colors and comfortable designs.
                </p>
                <Link to="/product" className="btn btn-primary gap-2">
                  Shop Collection <FiArrowRight />
                </Link>
              </div>
              <div className="hidden md:block">
                <img
                  src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                  alt="Summer Collection"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Browse our collections
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-base-content mt-2 mb-4">
              Shop by Category
            </h2>
            <p className="text-base-content/70 max-w-2xl mx-auto">
              Explore our wide range of categories and find exactly what you're
              looking for. From electronics to fashion, we've got you covered.
            </p>
          </div>

          {/*
            CATEGORY DISPLAY OPTIONS

            You have three different options for displaying categories:
            1. Option 1: Icon-based cards (currently active)
            2. Option 2: Abstract pattern cards (import CategoryCard from "../components/CategoryCard")
            3. Option 3: Minimalist illustration cards (import MinimalistCategoryCard from "../components/MinimalistCategoryCard")

            Uncomment the option you prefer and comment out the others
          */}

          {/* OPTION 1: Icon-based Category Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.slice(0, 6).map((category, index) => {
              // Get the appropriate icon component for this category
              const IconComponent = getCategoryIcon(category.name);

              // Generate a gradient based on the category index for visual variety
              const gradients = [
                "from-blue-500 to-indigo-600",
                "from-purple-500 to-pink-600",
                "from-green-500 to-teal-600",
                "from-orange-500 to-red-600",
                "from-cyan-500 to-blue-600",
                "from-pink-500 to-rose-600"
              ];
              const gradient = gradients[index % gradients.length];

              return (
                <Link
                  key={category._id}
                  to={`/product?category=${category._id}`}
                  className="group bg-base-100 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col border border-base-300"
                >
                  {/* Category Icon Header */}
                  <div
                    className={`bg-gradient-to-r ${gradient} p-8 flex items-center justify-center h-40`}
                  >
                    <IconComponent className="w-20 h-20 text-white opacity-90" />
                  </div>

                  {/* Category Content */}
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-base-content mb-2">
                      {category.name}
                    </h3>
                    <p className="text-base-content/70 text-sm mb-4 flex-grow">
                      Discover our selection of {category.name.toLowerCase()}{" "}
                      products at competitive prices.
                    </p>
                    <div className="mt-auto">
                      <span className="inline-flex items-center text-primary gap-2 font-medium group-hover:text-primary-focus transition-colors">
                        Shop Now{" "}
                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>

                  {/* Category badge */}
                  <div className="absolute top-4 right-4 bg-base-100/90 text-base-content text-xs font-medium px-2 py-1 rounded-full shadow-sm">
                    {index + 1} of {categories.length}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* OPTION 2: Abstract Pattern Cards
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.slice(0, 6).map((category, index) => (
              <CategoryCard
                key={category._id}
                category={category}
                index={index}
                totalCategories={categories.length}
              />
            ))}
          </div>
          */}

          {/* OPTION 3: Minimalist Illustration Cards
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.slice(0, 6).map((category, index) => (
              <MinimalistCategoryCard
                key={category._id}
                category={category}
                index={index}
                totalCategories={categories.length}
              />
            ))}
          </div>
          */}

          {/* View all categories button */}
          <div className="text-center mt-12">
            <Link to="/product" className="btn btn-outline btn-lg gap-2 px-8">
              View All Categories <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Special Offer Banner */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-secondary to-primary rounded-2xl overflow-hidden">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 p-10 md:p-16">
                <span className="inline-block px-4 py-1 bg-primary-content text-primary rounded-full font-medium text-sm mb-4">
                  Limited Time Offer
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-primary-content mb-4">
                  Get 20% Off Your First Order
                </h2>
                <p className="text-primary-content/90 mb-8">
                  Sign up for our newsletter and receive a special discount code
                  for your first purchase.
                </p>
                <Link
                  to="/product"
                  className="btn bg-primary-content hover:bg-primary-content/90 text-primary border-0"
                >
                  Shop Now
                </Link>
              </div>
              <div className="md:w-1/2">
                <img
                  src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2215&q=80"
                  alt="Special Offer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-base-content mb-10 text-center">
            What Our Customers Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-base-100 p-8 rounded-lg shadow-sm border border-base-300">
              <div className="flex text-yellow-400 mb-4">
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
              </div>
              <p className="text-base-content/70 mb-6">
                "I'm extremely satisfied with my purchase. The quality exceeded
                my expectations and the shipping was incredibly fast!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary font-bold">JD</span>
                </div>
                <div>
                  <h4 className="font-semibold text-base-content">John Doe</h4>
                  <p className="text-sm text-base-content/60">Loyal Customer</p>
                </div>
              </div>
            </div>

            <div className="bg-base-100 p-8 rounded-lg shadow-sm border border-base-300">
              <div className="flex text-yellow-400 mb-4">
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
              </div>
              <p className="text-base-content/70 mb-6">
                "The customer service is outstanding. They went above and beyond
                to help me find exactly what I was looking for."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary font-bold">JS</span>
                </div>
                <div>
                  <h4 className="font-semibold text-base-content">
                    Jane Smith
                  </h4>
                  <p className="text-sm text-base-content/60">Happy Shopper</p>
                </div>
              </div>
            </div>

            <div className="bg-base-100 p-8 rounded-lg shadow-sm border border-base-300">
              <div className="flex text-yellow-400 mb-4">
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
              </div>
              <p className="text-base-content/70 mb-6">
                "I've been shopping here for years and have never been
                disappointed. The products are high quality and the prices are
                fair."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary font-bold">RJ</span>
                </div>
                <div>
                  <h4 className="font-semibold text-base-content">
                    Robert Johnson
                  </h4>
                  <p className="text-sm text-base-content/60">
                    Repeat Customer
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-base-content mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-base-content/70 max-w-2xl mx-auto">
              Join our growing community of satisfied customers who trust us for
              their shopping needs.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                50K+
              </div>
              <div className="text-base-content/70 font-medium">
                Happy Customers
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">
                10K+
              </div>
              <div className="text-base-content/70 font-medium">
                Products Sold
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">
                99%
              </div>
              <div className="text-base-content/70 font-medium">
                Satisfaction Rate
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-success mb-2">
                24/7
              </div>
              <div className="text-base-content/70 font-medium">
                Support Available
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 rounded-2xl p-10 md:p-16 border border-base-300 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 rounded-full translate-y-24 -translate-x-24" />

            <div className="max-w-3xl mx-auto text-center relative z-10">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiShoppingBag className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-base-content mb-4">
                Subscribe to Our Newsletter
              </h2>
              <p className="text-base-content/70 mb-8">
                Stay updated with our latest products, exclusive offers, and
                helpful tips. Get 10% off your first order!
              </p>

              <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="input input-bordered flex-1 bg-base-100"
                  required
                />
                <button type="submit" className="btn btn-primary gap-2">
                  <FiArrowRight className="w-4 h-4" />
                  Subscribe
                </button>
              </form>
              <p className="text-sm text-base-content/60 mt-4">
                By subscribing, you agree to receive marketing emails. You can
                unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
