import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPen,
  faEye,
  faEyeSlash,
  faFire,
} from "@fortawesome/free-solid-svg-icons";
import AddProduct from "./AddProduct";
import UpdateProduct from "./UpdateProduct";
import Loading from "../../website/Loading";

const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [displayHotFilter, setDisplayHotFilter] = useState("all");
  const [displayTypeFilter, setDisplayTypeFilter] = useState("all");
  const [categories, setCategories] = useState([]);

  // Tách riêng hàm fetchProducts để tái sử dụng
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://cayxanhanphatbe-production.up.railway.app/api/products",
      ); // Đường dẫn API
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://cayxanhanphatbe-production.up.railway.app/api/categories",
      );
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!showAddModal && !showUpdateModal) {
      fetchProducts();
    }
  }, [showAddModal, showUpdateModal]);

  const handleCreateProduct = async (product) => {
    try {
      const response = await axios.post(
        "https://cayxanhanphatbe-production.up.railway.app/api/products",
        product,
      );
      setProducts([...products, response.data.data]);
      setShowAddModal(false);
    } catch (error) {
      console.error("Error creating product:", error.response.data.message);
    }
  };

  // Lọc sản phẩm theo từ khóa tìm kiếm
  const filteredProducts = products.filter((product) => {
    return (
      (categoryFilter === "all" || product.category?.name === categoryFilter) &&
      (displayHotFilter === "all" ||
        product.displayHot.toString() === displayHotFilter) &&
      (displayTypeFilter === "all" ||
        product.displayType.toString() === displayTypeFilter) &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Hàm toggle trạng thái display
  const toggleDisplayType = async (id) => {
    try {
      const updatedProducts = products.map((product) =>
        product._id === id
          ? { ...product, displayType: product.displayType === 1 ? 2 : 1 }
          : product,
      );
      setProducts(updatedProducts);

      // Gửi yêu cầu cập nhật API
      await axios.put(
        `https://cayxanhanphatbe-production.up.railway.app/api/products/${id}`,
        {
          displayType: updatedProducts.find((p) => p._id === id).displayType,
        },
      );
    } catch (error) {
      console.error("Error updating display type:", error);
    }
  };

  // Hàm toggle trạng thái hot
  const toggleDisplayHot = async (id) => {
    try {
      const updatedProducts = products.map((product) =>
        product._id === id
          ? { ...product, displayHot: product.displayHot === 1 ? 2 : 1 }
          : product,
      );
      setProducts(updatedProducts);

      // Gửi yêu cầu cập nhật API
      await axios.put(
        `https://cayxanhanphatbe-production.up.railway.app/api/products/${id}`,
        {
          displayHot: updatedProducts.find((p) => p._id === id).displayHot,
        },
      );
    } catch (error) {
      console.error("Error updating display hot:", error);
    }
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowUpdateModal(true);
  };

  return (
    <div className="flex items-center justify-center bg-gray-50">
      <div className="h-[600px] w-full max-w-7xl rounded-lg bg-white p-6 shadow-lg">
        {/* Tìm kiếm sản phẩm */}
        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <input
            type="text"
            placeholder="Tìm kiếm bằng tên sản phẩm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-72 rounded-md border border-gray-300 p-2"
          />
          <div className="flex gap-4">
            <select
              className="rounded-md border border-gray-300 p-2"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">Tất cả thực đơn</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              className="rounded-md border border-gray-300 p-2"
              value={displayHotFilter}
              onChange={(e) => setDisplayHotFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái Hot</option>
              <option value="1">Hot</option>
              <option value="2">Không Hot</option>
            </select>
            <select
              className="rounded-md border border-gray-300 p-2"
              value={displayTypeFilter}
              onChange={(e) => setDisplayTypeFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái hoạt động</option>
              <option value="1">Hoạt động</option>
              <option value="2">Không hoạt động</option>
            </select>
            <button
              onClick={() => {
                setCategoryFilter("all");
                setDisplayHotFilter("all");
                setDisplayTypeFilter("all");
                setSearchTerm("");
                fetchProducts(); // Lấy lại toàn bộ sản phẩm từ API
              }}
              className="rounded-md bg-gray-500 px-4 pb-2 pt-3 font-josefin text-xl text-white transition-transform duration-200 hover:scale-90"
            >
              Tất cả
            </button>
          </div>
          <div className="group relative">
            <button
              onClick={() => setShowAddModal(true)}
              className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <span className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-gray-800 px-4 py-2 text-sm text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              Tạo sản phẩm
            </span>
          </div>
        </div>

        {/* Component AddProduct */}
        {showAddModal && (
          <AddProduct
            showModal={showAddModal}
            setShowModal={setShowAddModal}
            onCreateProduct={handleCreateProduct}
          />
        )}

        {/* Component UpdateProduct */}
        {selectedProduct && showUpdateModal && (
          <UpdateProduct
            showModal={showUpdateModal}
            setShowModal={setShowUpdateModal}
            product={selectedProduct}
            onUpdateProduct={(updatedProduct) => {
              setProducts((prevProducts) =>
                prevProducts.map((p) =>
                  p._id === updatedProduct._id ? updatedProduct : p,
                ),
              );
              setShowUpdateModal(false);
            }}
          />
        )}

        {loading ? (
          // Hiển thị phần loading
          <div className="flex h-[255px] w-full items-center justify-center lg:h-[400px]">
            <Loading />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-md">
            {/* Tiêu đề cố định */}
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="w-[150px] px-4 py-3 text-center">Ảnh</th>
                  <th className="w-[300px] px-4 py-3 text-left">
                    Tên sản phẩm
                  </th>
                  <th className="w-[200px] px-4 py-3 text-center">Thực đơn</th>
                  <th className="w-[150px] px-4 py-3 text-center">Giá</th>
                  <th className="w-[150px] px-4 py-3 text-center">Giá giảm</th>
                  <th className="w-[150px] px-4 py-3 text-center">Ngày sửa</th>
                  <th className="w-[140px] px-4 py-3 text-center">Hot</th>
                  <th className="w-[140px] px-4 py-3 text-center">Hoạt động</th>
                  <th className="w-[130px] px-4 py-3 text-center">Sửa</th>
                </tr>
              </thead>
            </table>

            {/* Nội dung cuộn */}
            <div className="max-h-[456px] overflow-y-auto">
              <table className="min-w-full table-auto">
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="border-b">
                      <td className="w-[150px] px-4 py-6">
                        <img
                          src={`${product.image}`}
                          alt={product.name}
                          className="h-20 w-auto rounded-md object-cover"
                        />
                      </td>
                      <td className="line-clamp-2 h-[90px] w-[222px] px-4 pb-2 pt-12 font-bold">
                        {product.name}
                      </td>
                      <td className="w-[200px] px-4 py-6 text-center">
                        {product.category?.name || "chưa có"}
                      </td>
                      <td className="w-[150px] px-4 py-6 text-center">
                        {product.price.toLocaleString()} ₫
                      </td>
                      <td className="w-[150px] px-4 py-6 text-center">
                        {product.sell_price.toLocaleString()} ₫
                      </td>
                      <td className="px-4 py-6 text-center">
                        {new Date(product.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="w-[150px] px-4 py-6 text-center">
                        <div className="group relative">
                          <FontAwesomeIcon
                            icon={faFire}
                            className={
                              product.displayHot === 1
                                ? "cursor-pointer text-2xl text-red-500"
                                : "cursor-pointer text-xl text-gray-400"
                            }
                            onClick={() => toggleDisplayHot(product._id)}
                          />
                          <span className="absolute bottom-full left-1/2 mb-4 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-gray-800 px-2 py-2 text-sm text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                            Đặt làm Hot
                          </span>
                        </div>
                      </td>
                      <td className="w-[150px] px-4 py-6 text-center">
                        <div className="group relative">
                          <FontAwesomeIcon
                            icon={
                              product.displayType === 1 ? faEye : faEyeSlash
                            }
                            className={
                              product.displayType === 1
                                ? "cursor-pointer text-2xl text-blue-500"
                                : "cursor-pointer text-xl text-gray-400"
                            }
                            onClick={() => toggleDisplayType(product._id)}
                          />
                          <span className="absolute bottom-full left-1/2 mb-4 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-gray-800 px-2 py-2 text-sm text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                            Bật hoạt động
                          </span>
                        </div>
                      </td>
                      <td className="w-[100px] px-4 py-6 text-center text-xl">
                        <div className="group relative">
                          <button
                            className="rounded-full px-3 py-1 text-blue-400 hover:bg-slate-300"
                            onClick={() => handleEditProduct(product)}
                          >
                            <FontAwesomeIcon icon={faPen} />
                          </button>
                          <span className="absolute bottom-full left-1/3 mb-4 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-gray-800 px-2 py-2 text-sm text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                            Chỉnh sửa
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProduct;
