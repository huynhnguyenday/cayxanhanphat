import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const SidebarCart = ({ handleCartClick }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const tempCart = JSON.parse(localStorage.getItem("tempCart")) || [];
    setCartItems(tempCart);
  }, []);

  // Cập nhật tổng giá trị giỏ hàng khi cartItems thay đổi
  useEffect(() => {
    const total = cartItems.reduce(
      (total, item) => total + (item.quantity || 0) * item.price,
      0,
    );
    setTotalPrice(total);
  }, [cartItems]);

  const removeItem = (id) => {
    // Xóa sản phẩm khỏi giỏ hàng tạm thời
    const updatedCart = cartItems.filter((item) => item.productId !== id);
    setCartItems(updatedCart);
    localStorage.setItem("tempCart", JSON.stringify(updatedCart));

    // Cập nhật lại tổng giá trị
    const total = updatedCart.reduce(
      (total, item) => total + item.quantity * item.price,
      0,
    );
    setTotalPrice(total);
  };

  const decreaseQuantity = (productId) => {
    setCartItems((prevCartItems) => {
      const updatedCart = prevCartItems.map((item) =>
        item.productId === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      );
      // Lưu lại vào localStorage
      localStorage.setItem("tempCart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const increaseQuantity = (productId) => {
    setCartItems((prevCartItems) => {
      const updatedCart = prevCartItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
      // Lưu lại vào localStorage
      localStorage.setItem("tempCart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const handleQuantityChange = (e, productId) => {
    const value = e.target.value;
    const numericValue = parseInt(value, 10);

    setCartItems((prevCartItems) => {
      const updatedCart = prevCartItems.map((item) => {
        if (item.productId === productId) {
          if (!value) {
            // Khi người dùng xóa hết, giữ trống tạm thời
            return { ...item, quantity: "" };
          } else if (!isNaN(numericValue) && numericValue >= 1) {
            // Khi nhập số hợp lệ
            return { ...item, quantity: numericValue };
          }
        }
        return item;
      });

      // Lưu lại vào localStorage
      localStorage.setItem("tempCart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const handleBlur = (productId) => {
    setCartItems((prevCartItems) => {
      const updatedCart = prevCartItems.map((item) =>
        item.productId === productId && item.quantity === ""
          ? { ...item, quantity: 1 }
          : item,
      );
      // Lưu lại vào localStorage
      localStorage.setItem("tempCart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };


  const handlePaymentClick = () => {
    toast.info(
      <div>
        <strong>Hãy đăng nhập</strong> để có thể xem lại lịch sử đơn hàng
      </div>,
      {
        autoClose: 2000, // Close after 5 seconds
        hideProgressBar: false, // Show progress bar
        closeOnClick: true, // Close when clicked
        pauseOnHover: true, // Pause when hovering
        draggable: true, // Allow dragging
        className: "custom-toast", // Custom class for styling
        style: {
          color: "black", // Custom text color
          fontSize: "20px", // Custom font size
          fontFamily: "Josefin Sans", // Custom font family
          padding: "12px 20px", // Padding to make the toast look nicer
          borderRadius: "8px",
        },
      },
    );
  };

  return (
    <div className="fixed right-0 top-0 z-[1000] flex h-full w-[370px] flex-col overflow-y-auto bg-white p-3 shadow-lg transition-transform ease-in-out">
      <button
        className="absolute right-5 top-2 cursor-pointer border-none bg-transparent text-3xl text-[#909090] hover:text-black"
        onClick={handleCartClick}
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
      <div className="mb-2 text-center text-2xl font-bold text-[#633c02]">
        Giỏ hàng
      </div>

      <div className="mb-5 border-b-2 border-[#ccc]" />

      <div className="flex-grow overflow-y-auto">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div
              key={item.productId}
              className="relative mb-4 flex ml-1 h-[120px] w-[328px] items-start rounded-lg border border-[#ddd] p-2"
            >
              <img
                src={item.img}
                alt={item.name}
                className="mt-2 mr-4 h-[85px] w-[50px] object-cover"
              />
              <div className="flex flex-grow flex-col">
                <div className="mb-3 h-[50px] w-[170px] font-josefin text-xl font-bold text-[#00561e]">
                  {item.name}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <button
                      onClick={() => decreaseQuantity(item.productId)}
                      className="rounded-full bg-gray-200 px-3 py-1 hover:bg-gray-300"
                    >
                      -
                    </button>
                    <input
                      type="text"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(e, item.productId)}
                      onBlur={() => handleBlur(item.productId)}
                      className="w-12 h-8 mx-1 rounded border text-center"
                    />
                    <button
                      onClick={() => increaseQuantity(item.productId)}
                      className="rounded-full bg-gray-200 px-3 py-1 hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-end font-josefin text-lg text-black mt-1">
                    {(item.quantity * item.price).toLocaleString()}₫
                  </div>
                </div>
              </div>
              <button
                className="absolute right-3 top-2 cursor-pointer border-none bg-transparent text-xl text-red-300 hover:text-red-500"
                onClick={() => removeItem(item.productId)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))
        ) : (
          <p className="text-center font-josefin text-lg font-bold text-black">
            Bạn chưa thêm sản phẩm vào giỏ hàng
          </p>
        )}
      </div>
      <div className="mt-2 flex justify-between font-bold">
        <span className="text-2xl font-josefin font-bold mt-2">Tổng cộng:</span>
        <span className="text-2xl font-josefin font-bold mt-2 mr-2">{totalPrice.toLocaleString()}đ</span>
      </div>
      <Link to="/payment" state={{ cartItems, totalPrice }}>
        <button
          className="mt-3 w-full cursor-pointer border-none bg-black p-2 text-white transition-transform duration-200 hover:scale-95"
          onClick={() => {
            handleCartClick();
            handlePaymentClick();
          }}
        >
          Thanh toán
        </button>
      </Link>
    </div>
  );
};

export default SidebarCart;
