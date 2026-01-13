import { Check, X, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminSidebar from "../../components/Adminnavbar";

const BargainRequests = () => {
  const [bargainsData, setBargainsData] = useState([]);


  // Fetch bargains
  const fetchBargains = async () => {
    try {
      const res = await api.get("/admin/packagebargain");
      setBargainsData(res.data.data);
    } catch (error) {
      console.log(error.message);
    } 
  };

  useEffect(() => {
    fetchBargains();
  }, []);


  return (
    <>
      <AdminSidebar />
      <div className="ml-64 p-6 bg-[#f9fafb] min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Bargain Requests</h1>

        {bargainsData.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-2xl shadow p-5 border space-y-4 mb-10"
          >
            {/* PACKAGE INFO */}
            <div className="mb-4">
              <h2 className="text-xl font-semibold">{pkg.title}</h2>
              <p className="text-sm text-gray-600">
                Original Price: ${pkg.price.discountedPrice}
              </p>
              <p className="text-sm text-gray-600">Duration: {pkg.duration}</p>
            </div>

            {/* BARGAINS */}
            {pkg.bargains && pkg.bargains.length > 0 ? (
              pkg.bargains.map((bargainItem) => (
                <div
                  key={bargainItem.bargainId}
                  className="bg-gray-50 p-4 rounded-xl space-y-2 mb-4"
                >
                  {/* USER INFO + STATUS */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {bargainItem.user?.username || "Unknown User"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {bargainItem.user?.email || "-"}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        bargainItem.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : bargainItem.status === "accepted"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {bargainItem.status?.toUpperCase() || "PENDING"}
                    </span>
                  </div>

                  {/* OFFER DETAILS */}
                  <p className="text-sm font-semibold text-[#3ab19d]">
                    Offered Price: ${bargainItem.offerprice}
                  </p>
                  <p className="text-sm font-semibold text-[#3ab19d]">
                    Offered Date: {bargainItem.offerdate}
                  </p>
                  {bargainItem.notes && (
                    <p className="text-sm text-gray-700 italic">
                      “{bargainItem.notes}”
                    </p>
                  )}

  
                  <div className="flex gap-3 justify-end mt-2">
                    {bargainItem.status === "Pending" && (
                      <>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-400 text-white hover:bg-red-600">
                          <X size={18} /> Decline
                        </button>

                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-400 text-white hover:bg-green-700">
                          <Check size={18} /> Accept
                        </button>
                      </>
                    )}

                    {bargainItem.status === "accepted" && (
                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
                        <PlusCircle size={18} /> Create Custom Package
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No bargains for this package.</p>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default BargainRequests;
