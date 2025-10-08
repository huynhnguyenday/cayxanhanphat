import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useState } from "react";

const OrderFail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy dữ liệu từ state hoặc localStorage
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const { state } = location || {};
    const tempCart = JSON.parse(localStorage.getItem("tempCart")) || [];
    setCartItems(state?.cartItems || tempCart);
    setTotalPrice(
      state?.totalPrice ||
        tempCart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    );
  }, [location]);

  const handleBackToPayment = () => {
    navigate("/payment", { state: { cartItems, totalPrice } });
  };

  return (
    <div className="success-container mb-28 mt-20 flex flex-col place-content-center items-center sm:mb-32 sm:mt-32">
      <FontAwesomeIcon icon={faCircleXmark} className="text-7xl text-red-500" />
      <h1 className="mt-4 text-center font-josefin text-3xl font-bold">
        Thanh toán thất bại
      </h1>
      <p className="mt-2 text-center font-josefin text-lg font-bold">
        Bạn đã gặp vấn đề trong lúc thanh toán! Vui lòng quay trở lại trang
        thanh toán và thực hiện đúng theo quy trình!
      </p>
      <button
        onClick={handleBackToPayment}
        className="mt-8 rounded-lg bg-[#d88453] px-6 pb-2 pt-4 font-josefin text-2xl text-white hover:rounded-3xl hover:bg-[#633c02]"
      >
        Quay về trang thanh toán
      </button>
    </div>
  );
};

export default OrderFail;
