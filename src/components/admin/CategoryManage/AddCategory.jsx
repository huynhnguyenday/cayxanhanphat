import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const AddCategory = ({ onAddCategory, onClose, onFetchCategories }) => {
  const [newCategory, setNewCategory] = useState({
    name: "",
    isActive: 1,
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: parseInt(value, 10) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.isActive) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    try {
      const response = await axios.post(
        "https://cayxanhanphatbe-production.up.railway.app/api/categories",
        newCategory,
      );

      if (response.data.success) {
        onAddCategory(response.data.data);
        onFetchCategories(); // Gọi lại hàm fetchCategories từ ManageCategory
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Có lỗi xảy ra khi tạo thực đơn.");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <h2 className="mb-4 flex justify-center text-4xl font-bold">
          Tạo thực đơn
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block pb-2 text-xl font-medium">
              Tên thực đơn
            </label>
            <input
              type="text"
              name="name"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 p-2"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <div className="mb-4">
            <label className="block pb-2 text-xl font-medium">
              Bật hoạt động
            </label>
            <select
              name="isActive"
              value={newCategory.isActive}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 p-2"
            >
              <option value={1}>Bật</option>
              <option value={2}>Tắt</option>
            </select>
          </div>
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-28 rounded-md bg-gray-300 px-4 py-2 text-black hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Tạo thực đơn
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddCategory.propTypes = {
  onAddCategory: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onFetchCategories: PropTypes.func.isRequired, // Thêm prop này
};

export default AddCategory;
