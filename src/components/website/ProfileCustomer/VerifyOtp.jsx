import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const VerifyOtp = ({ email, onSuccess, onClose }) => {
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Email từ props:", email); // Kiểm tra email đã nhận đúng chưa

      const response = await axios.post(
        "https://cayxanhanphatbe-production.up.railway.app/api/auth/verify-otp",
        {
          email,
          otp,
        },
      );
      console.log("Phản hồi từ backend:", response.data);

      if (response.data.success) {
        toast.success("Xác thực thành công!");
        onSuccess();
      } else {
        toast.error(response.data.message || "Mã OTP không đúng!");
      }
    } catch (error) {
      toast.error("Lỗi xác thực mã OTP!");
    }
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-xl bg-white p-6 shadow-lg">
        <h2 className="text-center font-josefin text-4xl font-bold">
          Nhập mã xác thực
        </h2>
        <h3 className="pt-2 text-center font-josefin text-xl font-bold">
          Mã Otp đã được gửi về email của bạn
        </h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Mã OTP"
            className="mt-4 w-full border border-gray-400 p-2"
          />
          <div className="mt-4 flex justify-between pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary rounded-md bg-gray-300 px-8 pb-2 pt-3 font-josefin text-xl text-black transition-transform duration-200 hover:scale-90"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn-primary rounded-md bg-black px-8 pb-2 pt-3 font-josefin text-xl text-white transition-transform duration-200 hover:scale-90"
            >
              Xác nhận
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
