import { useEffect, useState } from "react";
import Loading from "../../website/Loading";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingWhite from "../../../components/website/LoadingWhite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const ManageNewsletter = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [allSelected, setAllSelected] = useState(false);
  const [validCoupons, setValidCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const updateNewsletterCheckbox = async (id, checkbox) => {
    try {
      const response = await axios.put(
        `https://cayxanhanphatbe-production.up.railway.app/api/newsletters/${id}`,
        { checkbox },
      );
      if (response.data.success) {
        console.log("Cập nhật trạng thái checkbox thành công.");
      } else {
        console.error("Cập nhật trạng thái checkbox thất bại.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái checkbox:", error);
    }
  };

  const fetchValidCoupons = async () => {
    try {
      const response = await axios.get(
        "https://cayxanhanphatbe-production.up.railway.app/api/coupons/valid-coupons",
      );
      if (response.data.success) {
        setValidCoupons(response.data.data);
      } else {
        console.log("Không có coupon hợp lệ.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy coupon:", error);
    }
  };

  useEffect(() => {
    fetchValidCoupons();
  }, []);

  // Hàm xử lý khi người dùng chọn coupon
  const handleCouponSelect = (event) => {
    setSelectedCoupon(event.target.value);
  };

  useEffect(() => {
    const fetchNewsletters = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://cayxanhanphatbe-production.up.railway.app/api/newsletters",
        );
        if (response.data.success) {
          setNewsletters(response.data.data);
        } else {
          console.error("Thất bại khi lấy thông tin");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsletters();
  }, []);
  // Lọc danh sách theo email
  const filteredNewsletters = newsletters.filter((newsletter) => {
    const newsletterDate = new Date(newsletter.createdAt);
    const adjustedEndDate = endDate ? new Date(endDate) : null;

    if (adjustedEndDate) {
      adjustedEndDate.setDate(adjustedEndDate.getDate() + 1); // Include the entire endDate, up to the next day
      adjustedEndDate.setHours(12, 0, 0, 0); // Set end time to 12 PM on the endDate
    }

    const isWithinDateRange =
      (!startDate || new Date(startDate) <= newsletterDate) &&
      (!adjustedEndDate || newsletterDate < adjustedEndDate); // Filter to include end date

    const matchesSearchTerm = newsletter.gmail
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return isWithinDateRange && matchesSearchTerm;
  });

  // Thay đổi trạng thái checkbox
  const handleCheckboxChange = async (_id) => {
    // Lấy newsletter hiện tại để thay đổi checkbox trong frontend
    const updatedNewsletter = newsletters.find(
      (newsletter) => newsletter._id === _id,
    );

    // Cập nhật checkbox trong frontend ngay lập tức
    setNewsletters((prevNewsletters) =>
      prevNewsletters.map((newsletter) =>
        newsletter._id === _id
          ? { ...newsletter, checkbox: !newsletter.checkbox }
          : newsletter,
      ),
    );

    // Gọi API để cập nhật trạng thái checkbox ở backend
    await updateNewsletterCheckbox(_id, !updatedNewsletter.checkbox);
  };
  const handleSendCoupon = async () => {
    // Lọc ra danh sách email đã chọn
    const selectedEmails = newsletters
      .filter((newsletter) => newsletter.checkbox)
      .map((newsletter) => newsletter.gmail);

    if (!selectedEmails.length) {
      toast.error("Vui lòng chọn ít nhất một email để gửi.");
      return;
    }

    if (!selectedCoupon) {
      toast.error("Vui lòng chọn mã coupon để gửi.");
      return;
    }

    setIsSending(true);
    try {
      // Gửi API với danh sách email và coupon đã chọn
      const response = await axios.post(
        "https://cayxanhanphatbe-production.up.railway.app/api/coupons/send-coupon",
        {
          emails: selectedEmails, // Danh sách email
          couponCode: selectedCoupon, // Mã coupon
        },
      );

      if (response.data.success) {
        toast.success("Gửi coupon thành công!");

        // Xóa các email đã gửi thành công khỏi newsletter
        const deletePromises = newsletters
          .filter((newsletter) => newsletter.checkbox)
          .map((newsletter) =>
            axios.delete(
              `https://cayxanhanphatbe-production.up.railway.app/api/newsletters/${newsletter._id}`,
            ),
          );

        await Promise.all(deletePromises);

        // Cập nhật danh sách newsletter trong frontend
        setNewsletters((prevNewsletters) =>
          prevNewsletters.filter(
            (newsletter) => !newsletter.checkbox, // Loại bỏ những email đã chọn
          ),
        );

        console.log("Đã xóa các email đã gửi khỏi danh sách.");
      } else {
        toast.error("Gửi coupon thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi gửi coupon:", error);
      toast.error("Có lỗi xảy ra khi gửi coupon.");
    } finally {
      setIsSending(false); // Kết thúc trạng thái gửi
    }
  };

  const handleSelectAll = async () => {
    if (allSelected) {
      // Hủy chọn tất cả
      try {
        // Cập nhật checkbox trong frontend ngay lập tức
        setNewsletters((prevNewsletters) =>
          prevNewsletters.map((newsletter) => ({
            ...newsletter,
            checkbox: false, // Hủy chọn
          })),
        );

        // Gửi API cập nhật trạng thái checkbox về backend
        const promises = newsletters.map((newsletter) =>
          axios.put(
            `https://cayxanhanphatbe-production.up.railway.app/api/newsletters/${newsletter._id}`,
            {
              checkbox: false,
            },
          ),
        );
        await Promise.all(promises);
        console.log("Hủy chọn tất cả thành công!");
      } catch (error) {
        console.error("Lỗi khi hủy chọn tất cả:", error);
      }
    } else {
      // Chọn tất cả
      try {
        // Cập nhật checkbox trong frontend ngay lập tức
        setNewsletters((prevNewsletters) =>
          prevNewsletters.map((newsletter) => ({
            ...newsletter,
            checkbox: true, // Chọn tất cả
          })),
        );

        // Gửi API cập nhật trạng thái checkbox về backend
        const promises = newsletters.map((newsletter) =>
          axios.put(
            `https://cayxanhanphatbe-production.up.railway.app/api/newsletters/${newsletter._id}`,
            {
              checkbox: true,
            },
          ),
        );
        await Promise.all(promises);
        console.log("Chọn tất cả thành công!");
      } catch (error) {
        console.error("Lỗi khi chọn tất cả:", error);
      }
    }
    setAllSelected(!allSelected); // Đổi trạng thái nút
  };

  return (
    <div className="flex items-center justify-center bg-gray-50">
      <div className="h-[600px] w-full max-w-7xl rounded-lg bg-white p-6 shadow-lg">
        {/* Tìm kiếm người gửi mail */}
        <div className="mb-4 flex items-center justify-between">
          {/* Ô tìm kiếm */}
          <input
            type="text"
            placeholder="Tìm kiếm bằng email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-72 rounded-md border border-gray-300 p-2"
          />
          <div className="mb-4 flex items-center">
            <label className="mr-4 mt-8 font-josefin text-2xl font-bold">
              Từ:
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-5 w-40 rounded-md border border-gray-300 p-2"
            />
            <label className="mx-4 mt-8 font-josefin text-2xl font-bold">
              Đến:
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-5 w-40 rounded-md border border-gray-300 p-2"
            />
          </div>

          <button
            onClick={handleSelectAll}
            className={`w-[140px] rounded-md px-4 py-2 text-white transition-transform duration-200 hover:scale-95 ${
              allSelected ? "bg-red-600" : "bg-blue-500"
            }`}
          >
            {allSelected ? "Hủy chọn" : "Chọn tất cả"}
          </button>
        </div>

        {loading ? (
          <div className="flex h-[255px] w-full items-center justify-center lg:h-[300px]">
            <Loading />
          </div>
        ) : newsletters.length === 0 ? (
          <div className="flex h-[255px] items-center justify-center text-gray-500">
            Chưa có người gửi Gmail.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-md">
            {/* Tiêu đề bảng */}
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="w-[317px] px-4 py-3 text-center">Chọn</th>
                  <th className="w-[510px] px-4 py-3 text-left">Email</th>
                  <th className="w-[317px] px-4 py-3 text-left">Ngày gửi</th>
                </tr>
              </thead>
            </table>

            {/* Nội dung cuộn */}
            <div className="max-h-[360px] overflow-y-auto">
              <table className="min-w-full table-auto">
                <tbody>
                  {filteredNewsletters.map((newsletter) => (
                    <tr key={newsletter._id} className="border-b">
                      <td className="w-[317px] px-4 py-6 text-center">
                        <input
                          type="checkbox"
                          checked={newsletter.checkbox}
                          onChange={() => handleCheckboxChange(newsletter._id)}
                          className="h-4 w-4"
                        />
                      </td>
                      <td className="w-[540px] px-4 py-6 text-left font-bold">
                        {newsletter.gmail}
                      </td>
                      <td className="w-[317px] px-4 py-6 text-left font-bold">
                        {new Date(newsletter.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <div className="mb-4 flex items-center pt-4">
          <input
            type="text"
            placeholder="Chọn mã coupon để gửi"
            className="w-[313px] border border-gray-300 p-2"
            list="coupon-list" // Liên kết với datalist
            value={selectedCoupon} // Giá trị input sẽ được liên kết với state
            onChange={handleCouponSelect}
          />
          <button
            className={`ml-4 px-8 py-1 text-2xl text-white transition-transform duration-200 hover:scale-95 ${
              isSending ? "cursor-not-allowed bg-black" : "bg-black"
            }`}
            onClick={handleSendCoupon}
            disabled={isSending} // Vô hiệu hóa nút khi đang gửi
          >
            {isSending ? (
              <LoadingWhite />
            ) : (
              <FontAwesomeIcon icon={faPaperPlane} />
            )}
          </button>

          {/* Datalist chứa danh sách các coupon */}
          <datalist id="coupon-list">
            {validCoupons.map((coupon) => (
              <option key={coupon._id} value={coupon.code}>
                {coupon.code} - Giảm {coupon.discountValue.toLocaleString()}đ
              </option>
            ))}
          </datalist>
        </div>
      </div>
    </div>
  );
};

export default ManageNewsletter;
