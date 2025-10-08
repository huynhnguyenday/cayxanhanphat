import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const ChangePasswordCs = ({ onClose, onUpdateSuccess }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false); // Hiển thị mật khẩu cũ
  const [showNewPassword, setShowNewPassword] = useState(false); // Hiển thị mật khẩu mới
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Hiển thị mật khẩu xác nhận
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Kiểm tra mật khẩu mới phải có ít nhất 8 ký tự
    if (newPassword.length < 8) {
      setError("Mật khẩu mới phải có ít nhất 8 ký tự!");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới và mật khẩu xác nhận không khớp!");
      return;
    }

    try {
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
        toast.success("Đổi mật khẩu thành công!");
        onUpdateSuccess();
        setTimeout(() => {
          onClose();
        }, 500);
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
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded bg-white p-6 shadow-lg">
        <h2 className="flex justify-center font-josefin text-4xl font-bold">
          Đổi mật khẩu
        </h2>
        <form onSubmit={handleSubmit}>
          <label className="mb-2 mt-8 block font-josefin text-2xl font-bold">
            Mật khẩu cũ
          </label>
          <div className="relative">
            <input
              type={showOldPassword ? "text" : "password"}
              className="h-14 w-full rounded border-2 px-2 pb-3 pt-4 text-xl"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon
              icon={showOldPassword ? faEye : faEyeSlash}
              className="absolute right-4 top-1/2 -translate-y-1/2 transform cursor-pointer"
              onClick={() => setShowOldPassword(!showOldPassword)}
            />
          </div>

          <label className="mb-2 mt-4 block font-josefin text-2xl font-bold">
            Mật khẩu mới
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              className="h-14 w-full rounded border-2 px-2 pb-3 pt-4 text-xl"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon
              icon={showNewPassword ? faEye : faEyeSlash}
              className="absolute right-4 top-1/2 -translate-y-1/2 transform cursor-pointer"
              onClick={() => setShowNewPassword(!showNewPassword)}
            />
          </div>

          <label className="mb-2 mt-4 block font-josefin text-2xl font-bold">
            Nhập lại mật khẩu
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="h-14 w-full rounded border-2 px-2 pb-3 pt-4 text-xl"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon
              icon={showConfirmPassword ? faEye : faEyeSlash}
              className="absolute right-4 top-1/2 -translate-y-1/2 transform cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </div>

          {error && (
            <p className="mt-4 font-josefin text-lg text-red-500">{error}</p>
          )}
          {success && (
            <p className="mt-4 font-josefin text-lg text-green-500">
              {success}
            </p>
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

export default ChangePasswordCs;
