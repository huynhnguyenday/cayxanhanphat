import { useEffect, useState } from "react";
import ChangePasswordCs from "./ChangePasswordCs";
import ChangeInformation from "./ChangeInformation";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie"; // Thư viện xử lý cookies
import { decodeJWT } from "../../utils/jwtUtils"; // Hàm decodeJWT bạn đã tạo
import Loading from "../Loading";
import OrderHistory from "./OrderHistory";
import VerifyOtp from "./VerifyOtp"; // Thêm import VerifyOtp
import LoadingWhite from "../LoadingWhite";

const CustomerProfile = () => {
  const [profileData, setProfileData] = useState(null); // Trạng thái lưu thông tin tài khoản
  const [loading, setLoading] = useState(true); // Trạng thái loading

  // Trạng thái hiển thị modal
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [isInforModalOpen, setInforModalOpen] = useState(false);
  const [isOtpModalOpen, setOtpModalOpen] = useState(false); // Thêm trạng thái cho OTP modal
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [isSubmittingInfo, setIsSubmittingInfo] = useState(false);
  const [otpTarget, setOtpTarget] = useState("");

  const fetchProfileData = async () => {
    try {
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

      const response = await axios.get(
        `https://cayxanhanphatbe-production.up.railway.app/api/accounts/${userId}`,
      );

      if (response.data.success) {
        setProfileData(response.data.data);
      } else {
        toast.error(
          response.data.message || "Không thể tải thông tin tài khoản!",
        );
      }
    } catch (error) {
      toast.error("Lỗi khi tải thông tin tài khoản!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleOpenOtpModal = async (target) => {
    const email = profileData?.gmail;
    if (!email) {
      toast.error("Không có email trong thông tin tài khoản!");
      return;
    }

    // Chọn trạng thái loading dựa trên target
    if (target === "changePassword") setIsSubmittingPassword(true);
    if (target === "updateInfo") setIsSubmittingInfo(true);

    try {
      const response = await axios.post(
        "https://cayxanhanphatbe-production.up.railway.app/api/auth/send-otp",
        { email },
      );

      if (response.data.success) {
        toast.success("Mã OTP đã được gửi. Vui lòng kiểm tra email!");
        setOtpModalOpen(true);
        setOtpTarget(target);
      } else {
        toast.error("Gửi OTP thất bại!");
      }
    } catch (error) {
      toast.error("Lỗi khi gửi mã OTP!");
    } finally {
      // Tắt trạng thái loading
      if (target === "changePassword") setIsSubmittingPassword(false);
      if (target === "updateInfo") setIsSubmittingInfo(false);
    }
  };

  const handleOtpSuccess = () => {
    setOtpModalOpen(false); // Đóng modal OTP
    if (otpTarget === "updateInfo") {
      setInforModalOpen(true); // Mở modal ChangeInformation
    } else if (otpTarget === "changePassword") {
      setPasswordModalOpen(true); // Mở modal ChangePasswordCs
    }
  };

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (!profileData) {
    return <div>Không thể hiển thị thông tin tài khoản!</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl rounded-lg bg-white p-6">
        <div className="mb-4 text-center font-josefin text-4xl font-bold">
          Trang cá nhân
        </div>

        <div className="mb-4 ml-20 flex max-w-4xl space-x-6">
          <div className="w-2/3">
            <label className="mt-4 block font-josefin text-2xl font-bold">
              Tên người dùng
            </label>
            <input
              type="text"
              value={profileData.username}
              disabled
              className="peer block w-3/4 border-0 border-b-2 border-gray-300 bg-transparent pl-2 pt-2 text-lg text-gray-900"
            />
            <label className="mt-8 block font-josefin text-2xl font-bold">
              Email
            </label>
            <input
              type="email"
              value={profileData.gmail}
              disabled
              className="peer block w-3/4 border-0 border-b-2 border-gray-300 bg-transparent px-0 pt-2 text-lg text-gray-900"
            />
            <label className="mt-8 block font-josefin text-2xl font-bold">
              Số điện thoại
            </label>
            <input
              type="tel"
              value={profileData.numbers}
              disabled
              className="peer block w-3/4 border-0 border-b-2 border-gray-300 bg-transparent px-0 pt-2 text-lg text-gray-900"
            />
          </div>

          <div className="flex w-1/2 flex-col items-center justify-center">
            <button
              className="w-3/4 rounded bg-black px-4 py-2 text-white transition-transform duration-200 hover:scale-95"
              onClick={() => handleOpenOtpModal("changePassword")}
              disabled={isSubmittingPassword}
            >
              {isSubmittingPassword ? <LoadingWhite /> : "Đổi mật khẩu"}
            </button>
            <button
              className="mt-8 w-3/4 rounded bg-black px-4 py-2 text-white transition-transform duration-200 hover:scale-95"
              onClick={() => handleOpenOtpModal("updateInfo")}
              disabled={isSubmittingInfo}
            >
              {isSubmittingInfo ? <LoadingWhite /> : "Cập nhật thông tin"}
            </button>
          </div>
        </div>
      </div>
      <div className="w-full max-w-7xl rounded-lg bg-white p-6">
        <OrderHistory />
      </div>

      {isPasswordModalOpen && (
        <ChangePasswordCs
          onClose={() => setPasswordModalOpen(false)}
          onUpdateSuccess={fetchProfileData}
        />
      )}

      {isInforModalOpen && (
        <ChangeInformation
          onClose={() => setInforModalOpen(false)}
          onUpdateSuccess={fetchProfileData}
        />
      )}

      {isOtpModalOpen && (
        <VerifyOtp
          email={profileData?.gmail}
          onSuccess={handleOtpSuccess}
          onClose={() => setOtpModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CustomerProfile;
