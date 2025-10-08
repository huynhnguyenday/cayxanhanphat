import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import PropTypes from "prop-types";

const UpdateAccount = ({ account, onClose, onUpdateAccount }) => {
  const [updatedAccount, setUpdatedAccount] = useState(account);
  const [errors, setErrors] = useState({}); // State lưu lỗi

  useEffect(() => {
    setUpdatedAccount(account);
  }, [account]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedAccount({ ...updatedAccount, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({}); // Reset errors trước khi kiểm tra

    if (!updatedAccount.username || !updatedAccount.role) {
      setErrors((prev) => ({
        ...prev,
        username: updatedAccount.username
          ? ""
          : "Tên tài khoản không được để trống.",
        role: updatedAccount.role ? "" : "Vai trò không được để trống.",
      }));
      return;
    }

    axios
      .put(
        `https://cayxanhanphatbe-production.up.railway.app/api/accounts/${updatedAccount._id}`,
        updatedAccount,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`, // Lấy token từ cookie
          },
          withCredentials: true,
        },
      )
      .then((response) => {
        onUpdateAccount(updatedAccount);
        onClose();
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          // Hiển thị thông báo lỗi từ backend
          setErrors((prev) => ({
            ...prev,
            username: error.response.data.message, // Lỗi từ backend nếu có
          }));
        } else {
          console.error("There was an error updating the account:", error);
        }
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <h2 className="mb-4 flex justify-center text-4xl font-bold">
          Chỉnh sửa tài khoản
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block pb-2 text-xl font-medium">
              Tên tài khoản
            </label>
            <input
              type="text"
              name="username"
              value={updatedAccount.username}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 p-2"
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block pb-2 text-xl font-medium">Vai trò</label>
            <select
              name="role"
              value={updatedAccount.role}
              onChange={handleInputChange}
              className="w-1/2 rounded-md border border-gray-300 p-2"
            >
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="customer">Customer</option>
            </select>
          </div>
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-24 rounded-md bg-gray-300 px-4 py-2 text-black hover:bg-gray-400"
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

UpdateAccount.propTypes = {
  account: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    gmail: PropTypes.string.isRequired,
    numbers: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateAccount: PropTypes.func.isRequired,
};

export default UpdateAccount;
