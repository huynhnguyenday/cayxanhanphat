import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const UpdateCategory = ({ category, onClose, onUpdateCategory }) => {
  const [updatedCategory, setUpdatedCategory] = useState(category);
  const [error, setError] = useState(""); // State để lưu lỗi

  useEffect(() => {
    setUpdatedCategory(category);
    setError(""); // Reset lỗi khi modal mở lại
  }, [category]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCategory({ ...updatedCategory, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra tên mới có trùng với tên cũ không
    if (updatedCategory.name === category.name) {
      setError("Tên thực đơn đã tồn tại. Vui lòng chọn tên khác.");
      return;
    }

    axios
      .put(
        `https://cayxanhanphatbe-production.up.railway.app/api/categories/${updatedCategory._id}`,
        updatedCategory,
      )
      .then((response) => {
        onUpdateCategory(response.data.data); // Gửi dữ liệu cập nhật lên
        onClose(); // Đóng modal
      })
      .catch((error) => {
        console.error("Có lỗi khi cập nhật danh mục:", error);
        if (
          error.response?.status === 400 &&
          error.response.data?.message === "Category name must be unique"
        ) {
          setError("Tên thực đơn đã tồn tại. Vui lòng chọn tên khác."); // Lỗi từ API
        } else {
          setError("Đã xảy ra lỗi. Vui lòng thử lại."); // Lỗi chung
        }
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <h2 className="mb-4 flex justify-center text-4xl font-bold">
          Chỉnh sửa thực đơn
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block pb-2 text-xl font-medium">
              Tên thực đơn
            </label>
            <input
              type="text"
              name="name"
              value={updatedCategory.name}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 p-2"
              required
            />
            {error && ( // Hiển thị thông báo lỗi
              <div className="text-sm text-red-500">{error}</div>
            )}
          </div>
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-gray-300 px-4 py-2 text-black hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

UpdateCategory.propTypes = {
  category: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateCategory: PropTypes.func.isRequired,
};

export default UpdateCategory;
