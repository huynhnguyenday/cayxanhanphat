import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBasketShopping } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/website/Loading";
import Review from "../components/website/Review";
import RelatedProduct from "./RelatedProduct";

const DetailFood = () => {
  const [quantity, setQuantity] = useState(1);
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true); // Bật trạng thái loading trước khi gọi API
        const response = await axios.get(
          `https://cayxanhanphatbe-production.up.railway.app/api/mainPages/${id}`,
        );
        if (response.data.success) {
          const product = response.data.data;
          setProduct(product); // Lưu sản phẩm vào state
        } else {
          console.error("Sản phẩm không tồn tại hoặc API lỗi.");
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        setLoading(false); // Tắt trạng thái loading sau khi xử lý xong
      }
    };

    fetchProduct();
  }, [id, navigate]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://cayxanhanphatbe-production.up.railway.app/api/mainPages/activeCategories",
        );
        if (response.data.success) {
          setCategories(response.data.data);
        } else {
          console.error("Lỗi khi lấy danh mục.");
        }
      } catch (error) {
        console.error("Lỗi khi gọi API danh mục:", error);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[255px] w-full items-center justify-center lg:h-[550px]">
        <Loading />
      </div>
    );
  }

  if (!product) {
    return (
      <button
        type="button"
        className="mx-auto mb-20 mt-20 flex h-24 w-1/3 items-center justify-center rounded-full bg-black text-2xl text-white"
      >
        <a href="/menu" className="flex items-center space-x-2">
          <span className="text-xl">QUAY TRỞ LẠI THỰC ĐƠN</span>
        </a>
      </button>
    );
  }

  const activeCategory = product.category.name; // Đảm bảo sản phẩm có thuộc tính category

  const handleCategoryClick = (categoryName) => {
    navigate(`/menu?category=${categoryName}`);
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setQuantity("");
    } else {
      const numericValue = parseInt(value, 10);
      if (!isNaN(numericValue) && numericValue >= 1) {
        setQuantity(numericValue);
      }
    }
  };

  const handleBlur = () => {
    if (quantity === "") {
      setQuantity(1);
    }
  };

  const handleAddToCart = () => {
    // Lấy giỏ hàng hiện tại từ localStorage
    const tempCart = JSON.parse(localStorage.getItem("tempCart")) || [];

    // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
    const existingItemIndex = tempCart.findIndex(
      (item) => item.productId === product._id,
    );

    if (existingItemIndex > -1) {
      // Nếu đã tồn tại, tăng số lượng
      tempCart[existingItemIndex].quantity += quantity;
    } else {
      // Nếu chưa, thêm sản phẩm mới
      tempCart.push({
        productId: product._id,
        name: product.name,
        img: product.image,
        price: product.sell_price,
        quantity,
      });
    }

    // Lưu lại giỏ hàng vào localStorage
    localStorage.setItem("tempCart", JSON.stringify(tempCart));

    // Hiển thị thông báo (tuỳ chọn)
    toast.success("Thêm vào giỏ hàng thành công");
  };

  return (
    <div className="mx-auto w-full max-w-[1200px] pb-16 pt-8">
      <div className="flex flex-col md:flex-row">
        {/* Left Section */}
        <div className="w-full scale-90 cursor-pointer overflow-hidden rounded-lg md:w-[300px]">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Center Section */}
        <div className="items-center justify-center pt-14 md:px-16 md:pt-16">
          <div className="text-center md:text-left">
            <h1 className="w-[370px] px-1 pb-4 font-josefin text-5xl font-bold text-[#00561e] md:pl-0 lg:w-[393px]">
              {product.name}
            </h1>
            <p>
              <span className="font-josefin text-[30px] font-bold text-[#663402]">
                {product.sell_price.toLocaleString()}đ
              </span>
              {product.price !== product.sell_price && (
                <span className="price-old ml-2 text-2xl font-bold text-[#999] line-through">
                  {product.price.toLocaleString()} đ
                </span>
              )}
            </p>
            <div className="mb-4 mt-2 h-[1px] w-full bg-gray-300 lg:mb-2 lg:mt-0"></div>
            <span className="font-josefin-sans text-lg font-semibold">
              Số lượng:
            </span>
            <div className="mt-2 flex items-center justify-center gap-2 md:justify-start">
              <button
                className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-full bg-gray-300 text-[18px] font-bold"
                onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
              >
                -
              </button>
              <input
                type="text"
                value={quantity}
                onChange={handleQuantityChange}
                onBlur={handleBlur}
                className="h-[36px] w-[60px] rounded-md border border-gray-300 text-center text-[18px]"
              />
              <button
                className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-full bg-gray-300 text-[18px] font-bold"
                onClick={() => setQuantity((prev) => prev + 1)}
              >
                +
              </button>
            </div>
            <button
              className="mt-6 w-[330px] cursor-pointer rounded-full bg-gradient-to-r from-[#00864a] to-[#925802] pb-3 pt-4 font-josefin text-[28px] font-bold text-white transition-transform duration-200 hover:scale-95 lg:mt-4 lg:w-[393px]"
              onClick={handleAddToCart}
            >
              <FontAwesomeIcon icon={faBasketShopping} /> Thêm vào giỏ
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-[370px] pl-6 pt-16 md:w-[290px] lg:w-[400px] lg:pl-2">
          <h3 className="text-center font-josefin text-3xl font-bold text-[#663402] md:text-start">
            Danh mục thực đơn
          </h3>
          <ul className="m-0 list-none p-0 pt-4 text-center md:text-start">
            {categories.map((category) => (
              <li
                key={category._id}
                onClick={() => handleCategoryClick(category.name)}
                className={`cursor-pointer border-b border-gray-200 px-4 py-2 font-josefin text-lg transition-colors duration-300 ${
                  category.name === activeCategory
                    ? "bg-[#169cbe] font-bold text-white"
                    : "hover:bg-[#169cbe] hover:font-bold hover:text-white"
                }`}
              >
                {category.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Review Section */}
      <div className="mt-8">
        <Review productId={product._id} />
      </div>

      <div>
        <RelatedProduct productId={product._id} />
      </div>
    </div>
  );
};

export default DetailFood;
