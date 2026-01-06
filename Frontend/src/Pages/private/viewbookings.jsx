import { useState } from "react";
import AdminSidebar from "../../components/Adminnavbar";
import {Package} from "lucide-react"
const mockBookings = [
  {
    packageId: "1",
    title: "Bali Paradise Escape",
    price: 1200,
    bookings: [
      {
        bookingId: "b1",
        user: { name: "John Doe", email: "john@gmail.com" },
        travelers: 2,
        date: "2025-02-10",
        totalAmount: 2400,
        status: "Confirmed",
      },
      {
        bookingId: "b2",
        user: { name: "Sara Smith", email: "sara@gmail.com" },
        travelers: 1,
        date: "2025-02-12",
        totalAmount: 1200,
        status: "Pending",
      },
    ],
  },
  {
    packageId: "2",
    title: "Swiss Alps Adventure",
    price: 1800,
    bookings: [
      {
        bookingId: "b3",
        user: { name: "Alex Ray", email: "alex@gmail.com" },
        travelers: 3,
        date: "2025-03-01",
        totalAmount: 5400,
        status: "Confirmed",
      },
    ],
  },
];

export default function AdminBookingsPage() {
  const [expandedPackage, setExpandedPackage] = useState(null);

  return (
<>
<AdminSidebar></AdminSidebar>
    <div className=" ml-64 p-8 space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-4"><Package className="size-10 text-[#69d0ac]"></Package>Package Bookings</h1>

      {mockBookings.map((pkg) => {
        const totalRevenue = pkg.bookings.reduce(
          (sum, b) => sum + b.totalAmount,
          0
        );

        return (
          <div
            key={pkg.packageId}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            {/* Package Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{pkg.title}</h2>
                <p className="text-sm text-gray-500">
                  {pkg.bookings.length} bookings · ₹{totalRevenue}
                </p>
              </div>

              <button
                onClick={() =>
                  setExpandedPackage(
                    expandedPackage === pkg.packageId
                      ? null
                      : pkg.packageId
                  )
                }
                className="text-indigo-600 font-medium"
              >
                {expandedPackage === pkg.packageId
                  ? "Hide Bookings"
                  : "View Bookings"}
              </button>
            </div>

            {/* Bookings Table */}
            {expandedPackage === pkg.packageId && (
              <BookingsTable bookings={pkg.bookings} />
            )}
          </div>
        );
      })}
    </div>
    </>
  );
}
function BookingsTable({ bookings }) {
  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left text-sm">
            <th className="p-3">User</th>
            <th className="p-3">Email</th>
            <th className="p-3">Travelers</th>
            <th className="p-3">Date</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.bookingId} className="border-b text-sm">
              <td className="p-3">{b.user.name}</td>
              <td className="p-3">{b.user.email}</td>
              <td className="p-3">{b.travelers}</td>
              <td className="p-3">{b.date}</td>
              <td className="p-3 font-medium">₹{b.totalAmount}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    b.status === "Confirmed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {b.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
    
  );
}
