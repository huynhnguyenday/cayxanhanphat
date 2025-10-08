import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const ChangePassword = ({ onClose, onUpdateSuccess }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // States for toggling password visibility
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Kiểm tra mật khẩu mới và mật khẩu xác nhận
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới và mật khẩu xác nhận không khớp!");
      return;
    }

    if (newPassword.length < 8) {
      setError("Mật khẩu mới phải có ít nhất 8 ký tự!");
      return;
    }

    try {
      // Gọi API đổi mật khẩu
      const response = await axios.post(
        "https://cayxanhanphatbe-production.up.railway.app/api/auth/change-password",
        {
          oldPassword,
          newPassword,
          confirmNewPassword: confirmPassword,
        },
        { withCredentials: true },
      );

      if (response.data.success) {
        // Hiển thị thông báo thành công
        toast.success("Đổi mật khẩu thành công!");

        // Gọi callback cập nhật thông tin
        if (onUpdateSuccess) {
          onUpdateSuccess();
        }

        // Đóng modal
        onClose();
      } else {
        setError(response.data.message || "Đã xảy ra lỗi!");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Không thể đổi mật khẩu. Thử lại sau!",
      );
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded bg-white p-6 shadow-lg">
        <h2 className="flex justify-center font-josefin text-4xl font-bold">
          Đổi mật khẩu
        </h2>
        {/* Nội dung form */}
        <form onSubmit={handleSubmit}>
          <label className="mb-2 mt-8 block font-josefin text-2xl font-bold">
            Mật khẩu cũ
          </label>
          <div className="relative">
            <input
              type={showOldPassword ? "text" : "password"}
              className="h-11 w-full rounded border-2 p-2"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon
              icon={showOldPassword ? faEye : faEyeSlash}
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => setShowOldPassword(!showOldPassword)}
            />
          </div>

          <label className="mb-2 mt-4 block font-josefin text-2xl font-bold">
            Mật khẩu mới
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              className="h-11 w-full rounded border-2 p-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon
              icon={showNewPassword ? faEye : faEyeSlash}
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => setShowNewPassword(!showNewPassword)}
            />
          </div>

          <label className="mb-2 mt-4 block font-josefin text-2xl font-bold">
            Nhập lại mật khẩu
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="h-11 w-full rounded border-2 p-2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon
              icon={showConfirmPassword ? faEye : faEyeSlash}
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </div>

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

export default ChangePassword;
