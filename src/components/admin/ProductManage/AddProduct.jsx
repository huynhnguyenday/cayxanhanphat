import { useState, useEffect } from "react";
import axios from "axios";

const AddProduct = ({ showModal, setShowModal }) => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    image: null, // Đặt image là null thay vì chuỗi rỗng
    price: "",
    sell_price: "",
    category: "",
    displayType: 1,
    displayHot: 1,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [imageError, setImageError] = useState("");
  const [backendError, setBackendError] = useState("");

  // Lấy danh sách danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://cayxanhanphatbe-production.up.railway.app/api/categories",
        );
        const data = response.data;

        // Lọc danh mục có isActive = 1
        const activeCategories = data.data.filter(
          (category) => category.isActive === 1,
        );
        setCategories(activeCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct({ ...newProduct, image: file });
      setPreviewImage(URL.createObjectURL(file)); // Cập nhật ảnh xem trước
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset lỗi trước khi kiểm tra
    setPriceError("");
    setImageError("");
    setBackendError("");

    // Kiểm tra giá giảm và giá gốc
    if (parseFloat(newProduct.sell_price) > parseFloat(newProduct.price)) {
      setPriceError("Giá giảm phải thấp hơn giá gốc");
      return;
    }

    // Kiểm tra ảnh sản phẩm
    if (!newProduct.image) {
      setImageError("Hãy chọn ảnh cho sản phẩm");
      return;
    }

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("image", newProduct.image);
    formData.append("price", newProduct.price);
    formData.append("sell_price", newProduct.sell_price);
    formData.append("category", newProduct.category);
    formData.append("displayType", newProduct.displayType);
    formData.append("displayHot", newProduct.displayHot);

    try {
      const response = await axios.post(
        "https://cayxanhanphatbe-production.up.railway.app/api/products",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      console.log("Tạo sản phẩm thành công", response.data);
      setShowModal(false);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setBackendError(
          error.response.data.message || "Lỗi không xác định từ server",
        );
      } else {
        console.error("Error adding product", error.message);
        setBackendError("Có lỗi xảy ra khi tạo sản phẩm");
      }
    }
  };

  const handleNumericInput = (value, field) => {
    if (/^\d*$/.test(value)) {
      setNewProduct({ ...newProduct, [field]: value });
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-7xl rounded-lg bg-white p-6">
        <h2 className="mb-12 flex justify-center text-4xl font-bold">
          Tạo sản phẩm
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex space-x-6">
            <div className="w-2/3">
              <label className="block pb-2 text-xl font-medium">
                Tên sản phẩm
              </label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                required
                className={`h-12 w-full rounded-md border ${
                  error.includes("Sản phẩm đã tồn tại")
                    ? "border-red-500"
                    : "border-gray-300"
                } p-2`}
              />
              {backendError && (
                <p className="text-sm text-red-500">{backendError}</p>
              )}
              <label className="block pb-2 text-xl font-medium">Thực đơn</label>
              <select
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
                required
                className="h-12 w-1/2 rounded-md border border-gray-300 p-2"
              >
                <option value="">Chọn thực đơn</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-2/3">
              <label className="block pb-2 text-xl font-medium">
                Giá sản phẩm
              </label>
              <input
                type="text"
                value={newProduct.price}
                onChange={(e) => handleNumericInput(e.target.value, "price")}
                required
                className="h-12 w-full rounded-md border border-gray-300 p-2"
              />
              <label className="mt-4 block pb-2 text-xl font-medium">
                Giá Giảm
              </label>
              <input
                type="text"
                value={newProduct.sell_price}
                onChange={(e) =>
                  handleNumericInput(e.target.value, "sell_price")
                }
                required
                className={`h-12 w-full rounded-md border ${
                  priceError ? "border-red-500" : "border-gray-300"
                } p-2`}
              />
              {priceError && (
                <p className="mt-1 text-sm text-red-500">{priceError}</p>
              )}

              <div className="mt-4 flex space-x-4">
                <div className="w-1/2">
                  <label className="block pb-2 text-xl font-medium">
                    Đặt làm Hot
                  </label>
                  <select
                    value={newProduct.displayHot}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        displayHot: +e.target.value,
                      })
                    }
                    required
                    className="w-2/3 rounded-md border border-gray-300 p-2"
                  >
                    <option value={1}>Hot</option>
                    <option value={2}>Không Hot</option>
                  </select>
                </div>
                <div className="w-1/2">
                  <label className="block pb-2 text-xl font-medium">
                    Hiển thị sản phẩm
                  </label>
                  <select
                    value={newProduct.displayType}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        displayType: +e.target.value,
                      })
                    }
                    required
                    className="w-2/3 rounded-md border border-gray-300 p-2"
                  >
                    <option value={1}>Bật</option>
                    <option value={2}>Tắt</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="w-2/3">
              <label className="block pb-2 text-xl font-medium">
                Ảnh sản phẩm
              </label>
              <input
                type="file"
                onChange={handleImageChange}
                required
                accept="image/*"
                className={`w-full rounded-md border ${
                  imageError ? "border-red-500" : "border-gray-300"
                } p-2`}
              />
              {imageError && (
                <p className="mt-1 text-sm text-red-500">{imageError}</p>
              )}
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="mt-4 h-48 w-auto max-w-full object-contain"
                />
              )}
            </div>
          </div>
          <div className="mt-12 flex justify-center pt-6">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="mr-32 h-12 w-32 rounded-md bg-gray-300 px-4 py-2 text-black hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="h-12 w-36 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-800"
            >
              Tạo sản phẩm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
