import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import DetailOrder from "./DetailOrder";
import Loading from "../../website/Loading";
import ExcelJS from "exceljs";

const ManageOrder = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false); // State để hiển thị trạng thái loading
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(""); // Ngày bắt đầu
  const [endDate, setEndDate] = useState("");

  // Placeholder orders data
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://cayxanhanphatbe-production.up.railway.app/api/orders",
        );
        setOrders(response.data.data); // Cập nhật danh sách đơn hàng từ API
        setError(null); // Xóa lỗi nếu có
      } catch (err) {
        console.error("Lỗi khi lấy danh sách đơn hàng: ", err);
        setError("Không thể tải danh sách đơn hàng. Vui lòng thử lại!"); // Cập nhật lỗi
      } finally {
        setLoading(false); // Tắt trạng thái loading
      }
    };

    fetchOrders(); // Gọi hàm lấy dữ liệu
  }, []);

  // Filter orders based on search term
  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    const adjustedEndDate = endDate ? new Date(endDate) : null;

    if (adjustedEndDate) {
      adjustedEndDate.setDate(adjustedEndDate.getDate() + 1); // Bao gồm cả ngày endDate
    }

    const isWithinDateRange =
      (!startDate || new Date(startDate) <= orderDate) &&
      (!adjustedEndDate || orderDate < adjustedEndDate); // Lọc đến trước nửa đêm ngày hôm sau

    const matchesSearchTerm =
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());

    return isWithinDateRange && matchesSearchTerm;
  });

  // Handle showing order details
  const handleShowOrderDetail = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedOrder(null);
  };

  const handleOrderUpdated = () => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://cayxanhanphatbe-production.up.railway.app/api/orders",
        );
        setOrders(response.data.data);
        setError(null);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", err);
        setError("Không thể tải danh sách đơn hàng. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Danh sách đơn hàng");

    // Thêm tiêu đề
    worksheet.columns = [
      { header: "Tên", key: "name", width: 30 },
      { header: "Email", key: "email", width: 40 },
      { header: "Phương thức thanh toán", key: "paymentMethod", width: 25 },
      { header: "Ngày tạo đơn", key: "createdAt", width: 15 },
      { header: "Giảm giá", key: "discount", width: 15 },
      { header: "Tổng tiền cuối", key: "finalPrice", width: 15 },
    ];

    // Thêm dữ liệu chỉ từ danh sách đã lọc
    filteredOrders.forEach((order) => {
      worksheet.addRow({
        name: order.name,
        email: order.email,
        paymentMethod: order.paymentMethod,
        createdAt: new Date(order.createdAt).toLocaleDateString(),
        discount: `${order.discount.toLocaleString("vi-VN")} ₫`,
        finalPrice: `${order.finalPrice.toLocaleString("vi-VN")} ₫`,
      });
    });

    // In đậm và căn giữa tiêu đề
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true }; // In đậm
      cell.alignment = { horizontal: "center" }; // Canh giữa
    });

    // Xuất file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });

    // Tải file
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "DanhSachDonHang.xlsx";
    link.click();
  };

  return (
    <div className="flex items-center justify-center bg-gray-50">
      <div className="h-[600px] w-full max-w-7xl rounded-lg bg-white p-6 shadow-lg">
        {/* Tìm kiếm */}
        <div className="mb-4 flex items-center justify-between">
          <input
            type="text"
            placeholder="Tìm kiếm bằng tên hoặc email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-60 rounded-md border border-gray-300 p-2"
          />
          <div className="flex items-center gap-4">
            <span className="ml-8 pt-3 font-josefin text-2xl font-bold">
              Lọc từ:
            </span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-md border border-gray-300 p-2"
            />
            <span className="ml-8 pt-3 font-josefin text-2xl font-bold">
              Đến:
            </span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-md border border-gray-300 p-2"
            />
            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
              className="rounded-md bg-gray-500 px-4 pb-2 pt-3 font-josefin text-xl text-white transition-transform duration-200 hover:scale-90"
            >
              Tất cả
            </button>
          </div>
          <div className="group relative">
            <button
              onClick={exportToExcel}
              className="rounded-md bg-green-800 px-4 pb-2 pt-3 font-josefin text-3xl font-bold text-white transition-transform duration-200 hover:scale-90"
            >
              <FontAwesomeIcon icon={faFileExcel} />
            </button>
            <span className="absolute right-[100%] top-1/2 -translate-y-1/2 transform whitespace-nowrap rounded-md bg-gray-800 px-2 py-2 text-sm text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              Xuất Excel
            </span>
          </div>
        </div>

        {loading ? (
          // Hiển thị phần loading
          <div className="flex h-[255px] w-full items-center justify-center lg:h-[500px]">
            <Loading />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-md">
            {/* Tiêu đề cố định */}
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="w-[220px] px-4 py-3 text-center">
                    Tên khách hàng
                  </th>
                  <th className="w-[350px] px-4 py-3 text-center">Email</th>
                  <th className="w-[200px] px-4 py-3 text-center">
                    Phương thức thanh toán
                  </th>
                  <th className="w-[120px] px-4 py-3 text-center">
                    Ngày tạo đơn
                  </th>
                  <th className="w-[100px] px-4 py-3 text-center">Xem</th>
                </tr>
              </thead>
            </table>

            {/* Nội dung cuộn */}
            <div className="max-h-[450px] overflow-y-auto">
              <table className="min-w-full table-auto">
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b">
                      <td className="px-4 py-6 text-center font-bold">
                        {order.name}
                      </td>
                      <td className="px-4 py-6 text-center">{order.email}</td>
                      <td className="px-4 py-6 text-center">
                        {order.paymentMethod}
                      </td>
                      <td className="px-4 py-6 text-center">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-6 text-center text-xl">
                        <div className="group relative">
                          <button
                            onClick={() => handleShowOrderDetail(order)}
                            className="rounded-full px-3 py-1 text-blue-400 hover:bg-slate-300"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                          <span className="absolute left-[-110%] top-1/2 -translate-y-1/2 transform whitespace-nowrap rounded-md bg-gray-800 px-2 py-2 text-sm text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                            Xem chi tiết
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Hiển thị chi tiết đơn hàng */}
        {showDetailModal && (
          <DetailOrder
            order={selectedOrder}
            onClose={handleCloseDetailModal}
            onOrderUpdated={handleOrderUpdated}
          />
        )}
      </div>
    </div>
  );
};

export default ManageOrder;
