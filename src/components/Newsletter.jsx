import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const Newsletter = () => {
  const [email, setEmail] = useState(""); // Quản lý state của email
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn form reload lại trang
    if (!email) {
      alert("Vui lòng nhập email!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://cayxanhanphatbe-production.up.railway.app/api/newsletters",
        {
          gmail: email,
          checkbox: false,
          status: false,
        },
      );

      if (response.data.success) {
        toast.success("Đăng ký thành công!");
        setEmail(""); // Reset email input sau khi gửi thành công
      } else {
        toast.error(response.data.message || "Đăng ký thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi gửi email:", error.message);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f2f2f2] p-5">
      <div className="mx-auto w-full max-w-screen-xl">
        <div className="flex flex-col md:flex-row">
          <div className="flex flex-1 items-center justify-start text-left">
            <div>
              <h4 className="text-5xl font-bold text-[#d88453]">Đăng ký</h4>
              <p className="mb-4 mt-4 font-josefin text-base font-bold text-[#666]">
                Đăng ký để nhận thông tin sớm nhất về chương trình giảm giá.
              </p>
            </div>
          </div>

          <div className="ml-0 flex flex-1 items-center justify-end md:ml-80">
            <form onSubmit={handleSubmit} className="w-full">
              <div className="flex w-full flex-col items-center justify-center md:flex-row md:gap-0">
                <input
                  id="newsletter_email"
                  type="email"
                  placeholder="Email của bạn"
                  required
                  className="texy-2xl h-[46px] w-full border border-gray-300 p-2 font-josefin font-bold md:w-[300px]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  id="newsletter_submit"
                  type="submit"
                  disabled={loading}
                  className={`mb-4 mt-4 h-[46px] w-[160px] cursor-pointer border-none bg-[#d88453] font-josefin font-bold text-white hover:bg-[#633c02] md:mb-0 md:mt-0 md:w-[160px] ${
                    loading && "cursor-not-allowed opacity-50"
                  }`}
                >
                  {loading ? "Đang gửi..." : "Đăng ký"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
