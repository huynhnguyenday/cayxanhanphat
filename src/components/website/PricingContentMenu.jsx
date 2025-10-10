import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import new1 from "../../../assets/new1.jpg";
import new2 from "../../../assets/new2.jpg";
import new3 from "../../../assets/new3.jpg";
import Loading from "./Loading";

const PricingContentMenu = ({ closeFlyout }) => {
  const [categories, setCategories] = useState([]); // Default categories
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://cayxanhanphatbe-production.up.railway.app/api/mainPages/activeCategories",
        );
        const categoryData = response.data.data.map(
          (category) => category.name,
        );
        setCategories(categoryData); // Set fetched categories
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleNavigate = (category) => {
    closeFlyout();
    navigate(`/menu?category=${category}`);
  };

  const handleNavigateToMenu = () => {
    closeFlyout();
    navigate("/menu");
  };

  return (
    <div className="flex h-[480px] w-[1200px] bg-white shadow-xl">
      <div className="w-[400px] bg-[#2385a3] p-6 pr-4">
        <div className="mb-3 space-y-3">
          <h3 className="pb-4 text-3xl font-bold text-white">SẢN PHẨM</h3>
          {loading ? (
            // Hiển thị phần loading nếu dữ liệu chưa được tải
            <div className="flex h-[255px] w-full items-center justify-center lg:h-[50px]">
              <Loading /> {/* Hiển thị Loading khi đang tải dữ liệu */}
            </div>
          ) : (
            <div className="space-y-4 pb-4">
              {categories.map((category) => (
                <a
                  key={category}
                  onClick={() => handleNavigate(category)}
                  className="mr-4 block cursor-pointer border-b-[1px] border-white border-opacity-30 pl-2 !font-josefin text-base !text-white hover:!text-slate-400"
                >
                  + {category}
                </a>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={handleNavigateToMenu}
          className="w-1/2 rounded-lg border-2 border-[#d88453] bg-[#d88453] px-4 py-2 font-semibold text-white transition-colors hover:rounded-3xl hover:border-[#103e4c] hover:bg-[#103e4c]"
        >
          Xem ngay
        </button>
      </div>

      <div className="flex w-full flex-col">
        {/* Tiêu đề mới */}
        <div className="w-full py-4 pl-6 text-start">
          <h2 className="text-2xl font-bold text-[#633c02]">Tìm hiểu ngay!</h2>
        </div>

        <div className="flex pl-6">
          {/* Item 1 */}
          <div className="w-1/3 text-start">
            <div className="overflow-hidden">
              <img
                src={new2}
                alt="new1"
                className="h-[200px] w-full object-cover"
              />
            </div>
            <h3 className="mt-2 pt-2 text-2xl font-bold text-orange-700">
              Thanh Lịch Xanh
            </h3>
            <p className="mt-1 h-[60px] font-josefin text-base text-gray-600">
              Cây dáng cao thanh thoát, mang vẻ đẹp hiện đại và tinh tế, giúp
              không gian thêm sang trọng và tươi mới.
            </p>
            <button
              className="mt-2 pt-4 font-josefin text-xl font-semibold text-orange-700 hover:text-orange-900"
              onClick={handleNavigateToMenu}
            >
              Xem thêm
            </button>
          </div>

          {/* Item 2 */}
          <div className="w-1/3 px-4 text-start">
            <div className="overflow-hidden">
              <img
                src={new3}
                alt="new2"
                className="h-[200px] w-full object-cover"
              />
            </div>
            <h3 className="mt-2 pt-2 text-2xl font-bold text-orange-700">
              Sắc Lá Mềm
            </h3>
            <p className="mt-1 h-[60px] font-josefin text-base text-gray-600">
              Những chiếc lá tròn sọc xanh mềm mại, tạo cảm giác thư thái và gần
              gũi.
            </p>
            <button
              className="mt-2 pt-4 font-josefin text-xl font-semibold text-orange-700 hover:text-orange-900"
              onClick={handleNavigateToMenu}
            >
              Xem thêm
            </button>
          </div>

          {/* Item 3 */}
          <div className="w-1/3 px-4 text-start">
            <div className="overflow-hidden">
              <img
                src={new1}
                alt="new3"
                className="h-[200px] w-full object-cover"
              />
            </div>
            <h3 className="mt-2 pt-2 text-2xl font-bold text-orange-700">
              Xanh Bình An
            </h3>
            <p className="mt-1 h-[60px] font-josefin text-base text-gray-600">
              Cây lá lớn vươn cao đầy sức sống, tượng trưng cho may mắn và bình
              an.
            </p>
            <button
              className="mt-2 pt-4 font-josefin text-xl font-semibold text-orange-700 hover:text-orange-900"
              onClick={handleNavigateToMenu}
            >
              Xem thêm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingContentMenu;
