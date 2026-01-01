import AdminSidebar from "../../components/Adminnavbar";

 function AdminHeader({ title }) {
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md ml-64">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div className="flex items-center gap-4">
        <img src="/images/admin.png" alt="Admin" className="w-10 h-10 rounded-full" />
        <span className="font-medium">Admin</span>
      </div>
    </header>
  );
}
function DashboardCard({ title, value, color }) {
  return (
    <div className={`flex flex-col p-6 rounded-lg shadow-md ${color} text-white w-64`}>
      <h2 className="text-lg font-medium">{title}</h2>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

 export default function AdminDashboard() {
  const stats = [
    { title: "Total Packages", value: 12, color: "bg-[#10b981]" },
    { title: "Bookings Today", value: 5, color: "bg-[#3b82f6]" },
    { title: "Pending Bargains", value: 3, color: "bg-[#f59e0b]" },
    { title: "Active Challenges", value: 7, color: "bg-[#ef4444]" },
  ];

  return (
   
    <div>
         <AdminSidebar/>
      <AdminHeader title="Dashboard" />
      <main className="ml-64 p-6 mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <DashboardCard key={stat.title} {...stat} />
          ))}
        </div>
        <section className="mt-10">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <ul className="flex flex-col gap-3 text-gray-700">
              <li>Booking #102 created by User1</li>
              <li>Bargain request #54 pending approval</li>
              <li>New package "Explore Bali" added</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}