import AdminSidebar from "../../components/Adminnavbar";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import {
  TrendingUp,
  DollarSign,
  Users,
  Package,
  CalendarCheck,
  Handshake,
  Star,
  Trophy,
  Clock,
  Activity,
  User,
  CheckCircle,
  AlertCircle,
  FileText,
} from "lucide-react";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

function AdminHeader({ title }) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="flex justify-between items-center p-6 bg-white border-b border-gray-100 ml-64">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500 mt-1">{currentDate}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 bg-[#f0fdf9] px-4 py-2 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-[#3ab19d] flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-semibold text-gray-900 block">Admin</span>
            <span className="text-xs text-[#3ab19d]">Dashboard</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color, trend }) {
  const iconBgClasses = {
    emerald: "bg-[#3ab19d]",
    blue: "bg-blue-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
    purple: "bg-purple-500",
    indigo: "bg-indigo-500",
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:border-gray-200 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4 text-[#3ab19d]" />
              <span className="text-sm font-medium text-[#3ab19d]">
                {trend}
              </span>
            </div>
          )}
        </div>
        <div
          className={`w-14 h-14 rounded-2xl ${iconBgClasses[color]} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
  );
}

function ActiveUserCard({ user }) {
  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    );
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-[#f0fdf9] transition-colors">
      <div className="relative">
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.username}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#3ab19d] flex items-center justify-center text-white font-semibold text-sm">
            {getInitials(user.username)}
          </div>
        )}
        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{user.username}</p>
        <p className="text-xs text-gray-500">{user.email}</p>
      </div>
      <div className="text-right">
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            user.usertype === "Admin"
              ? "bg-purple-100 text-purple-700"
              : "bg-[#e6f7f4] text-[#3ab19d]"
          }`}
        >
          {user.usertype}
        </span>
        <p className="text-xs text-gray-400 mt-1">
          {getTimeAgo(user.lastActive)}
        </p>
      </div>
    </div>
  );
}

function ActivityItem({ activity }) {
  const getIcon = (type) => {
    switch (type) {
      case "booking":
        return <CalendarCheck className="w-4 h-4" />;
      case "bargain":
        return <Handshake className="w-4 h-4" />;
      case "request":
        return <FileText className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    const lowercaseStatus = status?.toLowerCase();
    if (
      lowercaseStatus === "confirmed" ||
      lowercaseStatus === "approved" ||
      lowercaseStatus === "paid"
    )
      return "bg-green-100 text-green-700";
    if (lowercaseStatus === "pending") return "bg-amber-100 text-amber-700";
    if (lowercaseStatus === "rejected" || lowercaseStatus === "cancelled")
      return "bg-rose-100 text-rose-700";
    return "bg-gray-100 text-gray-700";
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "booking":
        return "bg-blue-500";
      case "bargain":
        return "bg-amber-500";
      case "request":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
      <div
        className={`w-8 h-8 rounded-lg ${getTypeColor(activity.type)} flex items-center justify-center text-white shrink-0`}
      >
        {getIcon(activity.type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 font-medium">{activity.message}</p>
        {activity.package && (
          <p className="text-xs text-gray-500 mt-0.5 truncate">
            Package: {activity.package}
          </p>
        )}
      </div>
      <div className="text-right shrink-0">
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(activity.status)}`}
        >
          {activity.status}
        </span>
        <p className="text-xs text-gray-400 mt-1">
          {formatDate(activity.date)}
        </p>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, trendsRes, activityRes, usersRes] = await Promise.all([
          api.get("/admin/dashboard/stats"),
          api.get("/admin/dashboard/trends"),
          api.get("/admin/dashboard/activity"),
          api.get("/admin/dashboard/active-users"),
        ]);

        setStats(statsRes.data.data);
        setTrends(trendsRes.data.data);
        setActivities(activityRes.data.data);
        setActiveUsers(usersRes.data.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Refresh active users every 30 seconds
    const interval = setInterval(async () => {
      try {
        const usersRes = await api.get("/admin/dashboard/active-users");
        setActiveUsers(usersRes.data.data);
      } catch (error) {
        console.error("Error refreshing active users:", error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount}`;
  };

  // Chart data for bookings
  const bookingChartData = {
    labels: trends.map((t) => `${t.month} ${t.year}`),
    datasets: [
      {
        label: "Bookings",
        data: trends.map((t) => t.bookings),
        borderColor: "#3ab19d",
        backgroundColor: "rgba(58, 177, 157, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#3ab19d",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  // Chart data for revenue
  const revenueChartData = {
    labels: trends.map((t) => t.month),
    datasets: [
      {
        label: "Revenue",
        data: trends.map((t) => t.revenue),
        backgroundColor: trends.map((_, i) =>
          i === trends.length - 1 ? "#3ab19d" : "rgba(58, 177, 157, 0.3)",
        ),
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1f2937",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
        borderRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#9ca3af",
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: "rgba(156, 163, 175, 0.1)",
        },
        ticks: {
          color: "#9ca3af",
          font: {
            size: 11,
          },
        },
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y: {
        ...chartOptions.scales.y,
        ticks: {
          ...chartOptions.scales.y.ticks,
          callback: (value) => {
            if (value >= 100000) return `${value / 100000}L`;
            if (value >= 1000) return `${value / 1000}K`;
            return value;
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div>
        <AdminSidebar />
        <AdminHeader title="Dashboard" />
        <main className="ml-64 p-6 mt-4 flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#3ab19d] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">Loading dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats?.totalRevenue || 0),
      subtitle: `${formatCurrency(stats?.monthlyRevenue || 0)} this month`,
      icon: DollarSign,
      color: "emerald",
      trend: "+12.5%",
    },
    {
      title: "Total Bookings",
      value: stats?.totalBookings || 0,
      subtitle: `${stats?.bookingsToday || 0} today`,
      icon: CalendarCheck,
      color: "blue",
    },
    {
      title: "Bargain Requests",
      value: stats?.totalBargains || 0,
      subtitle: `${stats?.pendingBargains || 0} pending`,
      icon: Handshake,
      color: "amber",
    },
    {
      title: "Package Requests",
      value: stats?.totalRequests || 0,
      subtitle: `${stats?.pendingRequests || 0} pending`,
      icon: FileText,
      color: "purple",
    },
    {
      title: "Active Packages",
      value: stats?.activePackages || 0,
      subtitle: `${stats?.totalPackages || 0} total`,
      icon: Package,
      color: "indigo",
    },
    {
      title: "Challenges",
      value: stats?.activeChallenges || 0,
      subtitle: `${stats?.totalChallenges || 0} total`,
      icon: Trophy,
      color: "rose",
    },
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      subtitle: "Registered accounts",
      icon: Users,
      color: "blue",
    },
    {
      title: "Avg Rating",
      value: stats?.avgRating || "0.0",
      subtitle: `${stats?.totalReviews || 0} reviews`,
      icon: Star,
      color: "amber",
    },
  ];

  return (
    <div className="bg-[#fafbfc] min-h-screen">
      <AdminSidebar />
      <AdminHeader title="Dashboard" />
      <main className="ml-64 p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {statCards.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bookings Chart */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Booking Trends
                </h3>
                <p className="text-sm text-gray-500">Last 12 months overview</p>
              </div>
              <div className="flex items-center gap-2 text-[#3ab19d]">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-medium">12 months</span>
              </div>
            </div>
            <div className="h-70">
              <Line data={bookingChartData} options={chartOptions} />
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Monthly Revenue
                </h3>
                <p className="text-sm text-gray-500">Revenue breakdown</p>
              </div>
              <div className="flex items-center gap-2 text-[#3ab19d]">
                <DollarSign className="w-5 h-5" />
                <span className="text-sm font-medium">INR</span>
              </div>
            </div>
            <div className="h-70">
              <Bar data={revenueChartData} options={barChartOptions} />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Recent Activity
                  </h3>
                  <p className="text-sm text-gray-500">
                    Latest platform actions
                  </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f0fdf9] rounded-full">
                  <Activity className="w-4 h-4 text-[#3ab19d]" />
                  <span className="text-sm font-medium text-[#3ab19d]">
                    Live
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4 max-h-100 overflow-y-auto">
              {activities.length > 0 ? (
                <div className="space-y-2">
                  {activities.map((activity, index) => (
                    <ActivityItem key={index} activity={activity} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <Clock className="w-12 h-12 mb-3" />
                  <p className="font-medium">No recent activity</p>
                  <p className="text-sm">Activities will appear here</p>
                </div>
              )}
            </div>
          </div>

          {/* Active Users */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Active Users
                  </h3>
                  <p className="text-sm text-gray-500">Currently online</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-gray-900">
                    {activeUsers.length}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4 max-h-100 overflow-y-auto">
              {activeUsers.length > 0 ? (
                <div className="space-y-2">
                  {activeUsers.map((user) => (
                    <ActiveUserCard key={user.id} user={user} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <Users className="w-12 h-12 mb-3" />
                  <p className="font-medium">No active users</p>
                  <p className="text-sm text-center">
                    Users will appear when they're online
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats Footer */}
        <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.totalBookings - stats?.bookingsToday || 0}
              </p>
              <p className="text-sm text-gray-500">Completed Bookings</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 mb-3">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.pendingBargains || 0}
              </p>
              <p className="text-sm text-gray-500">Pending Approvals</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-3">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.activePackages || 0}
              </p>
              <p className="text-sm text-gray-500">Live Packages</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-3">
                <Trophy className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.activeChallenges || 0}
              </p>
              <p className="text-sm text-gray-500">Active Challenges</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
