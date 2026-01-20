import { useEffect, useState } from "react";
import AdminSidebar from "../../components/Adminnavbar";
import {Package} from "lucide-react"
import api from "../../api/axios";
import DataTable from "react-data-table-component";

  
function AdminBookingsPage() {
  const [expandedPackage, setExpandedPackage] = useState(null);
  const[allBookings,setAllBookings]=useState([]);

  const Bookings = async()=>{
    try {
      const res =  await api.get("/admin/packagebooking")
console.log(res.data.data)
setAllBookings(res.data.data)
console.log(res.data.data)
  }
    catch (error) {
      console.log(error.message)
      alert(error.response.data.message)
    }
  }
  useEffect(()=>{
    Bookings()
  },[])
  if(!allBookings){
    return <h3>No Bookings Found</h3>
  }
  return (
<>
<AdminSidebar></AdminSidebar>
    <div className=" ml-64 p-8 space-y-6">
      <h1 className="text-[20px]  flex items-center gap-4"><Package className="size-10 text-[#69d0ac]"></Package>Package Bookings</h1>

      {allBookings.map((pkg) => {
  const totalRevenue =
    pkg.bookings.length * Number(pkg.price.originalPrice);
        return (
          <div
            key={pkg.id}
            className="bg-white rounded-2xl shadow-lg p-6"
          >

            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-[16px] font-semibold">{pkg.title}</h2>
                      <p className="text-sm text-gray-500 mt-1">
                Created At:   {new Date(pkg.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {pkg.bookings.length} bookings · ₹{totalRevenue}
                </p>
              </div>

              <button
                onClick={() =>
                  setExpandedPackage(
                    expandedPackage === pkg.id
                      ? null
                      : pkg.id
                  )
                }
                className="text-[#3ab19d] font-medium"
              >
                {expandedPackage === pkg.id
                  ? "Hide Bookings"
                  : "View Bookings"}
              </button>
            </div>

            {expandedPackage === pkg.id && (
              <BookingsTable allBooking={pkg.bookings}  discountedPrice={pkg.price.originalPrice} />
            )}
          </div>
        );
      })}
    </div>
    </>
  );
}
function BookingsTable({ allBooking,discountedPrice }) {
  const columns = [
    {
      name: "User",
      selector: (row) => row.Fullname,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.Email,
      sortable: true,
    },
    {
      name: "Travelers",
      selector: (row) => row.Travelers,
      sortable: true,
      center: true,
    },
    {
      name: "Date",
      selector: (row) => new Date(row.Date).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => `₹ ${discountedPrice}`,
      sortable: true,
      right: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            row.status === "Confirmed"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="mt-6 bg-white rounded-xl shadow">
      <DataTable 
        columns={columns}
        data={allBooking}
        pagination
        highlightOnHover
        striped
        responsive
        customStyles={customStyles}
      />
      
    </div>
    
  );
  
}
const customStyles = {
  table: {
    style: {
      minHeight: "auto",
    },
  },
  headRow: {
    style: {
      backgroundColor: "#3ab19d",
      borderTopLeftRadius: "12px",
      borderTopRightRadius: "12px",
      fontWeight: "600",
      color:"white"
    },
  },
  headCells: {
    style: {
      fontSize: "14px",
      paddingLeft: "16px",
      paddingRight: "16px",
    },
  },
  rows: {
    style: {
      fontSize: "14px",
      minHeight: "56px",
      "&:hover": {
        backgroundColor: "#f0fdfa",
        cursor: "pointer",
      },
    },
  },
  cells: {
    style: {
      paddingLeft: "16px",
      paddingRight: "16px",
    },
  },
  pagination: {
    style: {
      borderTop: "1px solid #e5e7eb",
      paddingTop: "8px",
    },
    pageButtonsStyle: {
      borderRadius: "6px",
      height: "32px",
      width: "32px",
      padding: "0",
      margin: "0 4px",
      cursor: "pointer",
      transition: "0.2s",
      "&:hover": {
        backgroundColor: "#ecfeff",
      },
    },
  },
};

export default AdminBookingsPage