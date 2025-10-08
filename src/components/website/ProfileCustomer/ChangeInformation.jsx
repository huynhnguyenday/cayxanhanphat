import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { decodeJWT } from "../../utils/jwtUtils";

const ChangeInformation = ({ onClose, onUpdateSuccess }) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = Cookies.get("jwtToken");
      if (!token) {
        toast.error("Bạn chưa đăng nhập!");
        return;
      }
      const decoded = decodeJWT(token);
      const userId = decoded?.id;

      if (!userId) {
        toast.error("Token không hợp lệ!");
        return;
      }

      try {
        const response = await axios.get(
          `https://cayxanhanphatbe-production.up.railway.app/api/accounts/${userId}`,
        );
        if (response.data.success) {
          setEmail(response.data.data.gmail);
          setPhone(response.data.data.numbers);
        } else {
          toast.error("Không thể tải thông tin tài khoản!");
        }
      } catch (error) {
        toast.error("Lỗi khi tải thông tin tài khoản!");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("jwtToken");
    const decoded = decodeJWT(token);
    const userId = decoded?.id;
    setError("");

    if (!userId) {
      toast.error("Token không hợp lệ!");
      return;
    }

    if (!email && !phone) {
      setError(
        "Vui lòng nhập ít nhất một trong hai thông tin email hoặc số điện thoại.",
      );
      return;
    }

    // Validate phone number (starts with 0 and is 9-10 digits long)
    const phonePattern = /^0\d{8,9}$/;
    if (phone && !phonePattern.test(phone)) {
      setError(
        "Số điện thoại phải bắt đầu bằng 0 và có độ dài từ 9 đến 10 chữ số.",
      );
      return;
    }

    console.log("Dữ liệu gửi đi:", { gmail: email, numbers: phone });

    try {
      const response = await axios.put(
        `https://cayxanhanphatbe-production.up.railway.app/api/accounts/${userId}`,
        { gmail: email, numbers: phone },
      );
      if (response.data.success) {
        toast.success("Cập nhật thông tin thành công!");
        onUpdateSuccess();
        onClose();
      } else {
        toast.error("Không thể cập nhật thông tin!");
      }
    } catch (error) {
      toast.error("Lỗi khi cập nhật thông tin!");
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded bg-white p-6 shadow-lg">
        <h2 className="flex justify-center font-josefin text-4xl font-bold">
          Cập nhật thông tin
        </h2>
        <form onSubmit={handleSubmit}>
          <label className="mb-2 mt-8 block font-josefin text-2xl font-bold">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 w-full rounded border-2 p-2"
          />
          <label className="mb-2 mt-8 block font-josefin text-2xl font-bold">
            Số điện thoại
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-11 w-full rounded border-2 p-2"
          />
          {error && (
            <p className="mt-4 font-josefin text-lg text-red-500">{error}</p>
          )}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onClose}
              className="mt-4 w-20 rounded-md bg-gray-300 px-4 py-2 text-black transition-transform duration-200 hover:scale-95"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="mt-4 rounded-md bg-black px-8 py-2 text-white transition-transform duration-200 hover:scale-95"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeInformation;
