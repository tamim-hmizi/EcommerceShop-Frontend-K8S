import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { getCategories } from "../../services/categoryService";
import { getProducts } from "../../services/ProductService";
import { getAllOrders } from "../../services/OrderService";
import { getUsers } from "../../services/UserService";
import DashboardLayout from "../../components/admin/dashboard/DashboardLayout";
import {
  filterDataByTime,
  calculatePercentageChange,
  prepareSalesChartData,
  prepareCategoryChartData,
  prepareOrderStatusChartData,
  prepareUserGrowthData
} from "../../components/admin/dashboard/dashboardUtils";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    categories: 0,
    revenue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    totalStock: 0,
    avgOrderValue: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [timeFilter, setTimeFilter] = useState('all');
  const [salesData, setSalesData] = useState({ labels: [], datasets: [] });
  const [categoryData, setCategoryData] = useState({ labels: [], datasets: [] });
  const [orderStatusData, setOrderStatusData] = useState({ labels: [], datasets: [] });
  const [userGrowthData, setUserGrowthData] = useState({ labels: [], datasets: [] });
  const [statsChanges, setStatsChanges] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0
  });

  // Fetch dashboard data on component mount or when user/timeFilter changes
  const fetchDashboardData = useCallback(async (isRefreshing = false) => {
    try {
      if (!isRefreshing) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      console.log("Fetching dashboard data with token:", user?.token ? "Token exists" : "No token");

      const [categoriesResponse, productsResponse, ordersResponse, usersResponse] = await Promise.all([
        getCategories(),
        getProducts(),
        getAllOrders(user?.token),
        getUsers(user?.token)
      ]);

      console.log("API Responses:", {
        categories: categoriesResponse,
        products: productsResponse,
        orders: ordersResponse,
        users: usersResponse
      });

      // Extract data from responses
      const categories = categoriesResponse?.data || [];
      const products = productsResponse || [];
      const orders = ordersResponse?.data || [];
      const users = usersResponse?.data || [];

      console.log("Extracted Data:", {
        categoriesCount: categories.length,
        productsCount: products.length,
        ordersCount: orders.length,
        usersCount: users.length
      });

      // Filter orders based on time period if needed
      const filteredOrders = filterDataByTime(orders, timeFilter);

      // Calculate basic stats
      const revenue = filteredOrders.reduce((sum, order) => sum + order.totalPrice, 0);
      const pendingOrders = filteredOrders.filter(order => order.status.toLowerCase() === 'pending').length;
      const processingOrders = filteredOrders.filter(order => order.status.toLowerCase() === 'processing').length;
      const shippedOrders = filteredOrders.filter(order => order.status.toLowerCase() === 'shipped').length;
      const deliveredOrders = filteredOrders.filter(order => order.status.toLowerCase() === 'delivered').length;
      const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
      const avgOrderValue = filteredOrders.length > 0 ? revenue / filteredOrders.length : 0;

      // Get recent orders and top products
      const recent = [...filteredOrders]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      // Sort products by stock level (could be changed to sort by popularity if that data is available)
      const top = [...products]
        .sort((a, b) => b.stock - a.stock)
        .slice(0, 5);

      // Calculate percentage changes (mock data for now, would be based on previous period in real implementation)
      const changes = {
        users: calculatePercentageChange(users.length, users.length - Math.floor(Math.random() * 5)),
        products: calculatePercentageChange(products.length, products.length - Math.floor(Math.random() * 3)),
        orders: calculatePercentageChange(filteredOrders.length, filteredOrders.length - Math.floor(Math.random() * 10)),
        revenue: calculatePercentageChange(revenue, revenue - Math.floor(Math.random() * 1000))
      };

      // Prepare chart data
      const salesChartData = prepareSalesChartData(filteredOrders);
      const categoryChartData = prepareCategoryChartData(products, categories);
      const orderStatusChartData = prepareOrderStatusChartData(filteredOrders);
      const userGrowthChartData = prepareUserGrowthData(users);

      // Update state
      setStats({
        users: users.length,
        products: products.length,
        orders: filteredOrders.length,
        categories: categories.length,
        revenue,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        totalStock,
        avgOrderValue
      });
      setStatsChanges(changes);
      setRecentOrders(recent);
      setTopProducts(top);
      setSalesData(salesChartData);
      setCategoryData(categoryChartData);
      setOrderStatusData(orderStatusChartData);
      setUserGrowthData(userGrowthChartData);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, timeFilter]);



  // Handle time filter change
  const handleTimeFilterChange = (filter) => {
    setTimeFilter(filter);
  };

  // Refresh dashboard data
  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  useEffect(() => {
    if (!user) navigate("/");
    if (user && !user.isAdmin) navigate("/");

    fetchDashboardData();
  }, [user, navigate, fetchDashboardData, timeFilter]);

  return (
    <DashboardLayout
      user={user}
      stats={stats}
      statsChanges={statsChanges}
      salesData={salesData}
      orderStatusData={orderStatusData}
      categoryData={categoryData}
      userGrowthData={userGrowthData}
      recentOrders={recentOrders}
      topProducts={topProducts}
      timeFilter={timeFilter}
      loading={loading}
      refreshing={refreshing}
      handleTimeFilterChange={handleTimeFilterChange}
      handleRefresh={handleRefresh}
    />
  );
}