import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPen,
  faToggleOn,
  faToggleOff,
} from "@fortawesome/free-solid-svg-icons";
import AddAccount from "./AddAccount";
import UpdateAccount from "./UpdateAccount";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Loading from "../../website/Loading";

const ManageAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddFormVisible, setAddFormVisible] = useState(false);
  const [isUpdateFormVisible, setUpdateFormVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true); // Bắt đầu hiển thị loading
      try {
        const response = await axios.get(
          "https://cayxanhanphatbe-production.up.railway.app/api/accounts",
          {
            withCredentials: true,
          },
        );
        setAccounts(response.data.data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      } finally {
        setLoading(false); // Kết thúc loading sau khi lấy dữ liệu xong
      }
    };

    fetchAccounts();
  }, []);

  const filteredAccounts = accounts.filter(
    (account) =>
      (selectedStatus === null || account.isActive === selectedStatus) &&
      (account.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.gmail.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const toggleIsActive = async (id) => {
    const updatedAccount = accounts.find((account) => account._id === id);
    const newIsActive = updatedAccount.isActive === 1 ? 2 : 1;

    try {
      // Gửi yêu cầu cập nhật trạng thái `isActive`
      await axios.put(
        `https://cayxanhanphatbe-production.up.railway.app/api/accounts/${id}`,
        { isActive: newIsActive },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("jwtToken")}`,
          },
          withCredentials: true,
        },
      );

      // Cập nhật trạng thái trong state
      setAccounts((prevAccounts) =>
        prevAccounts.map((account) =>
          account._id === id ? { ...account, isActive: newIsActive } : account,
        ),
      );
    } catch (error) {
      console.error("Error updating isActive:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật",
      );
    }
  };

  const handleAddAccount = async (newAccount) => {
    try {
      const response = await axios.post(
        "https://cayxanhanphatbe-production.up.railway.app/api/accounts",
        newAccount,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("jwtToken")}`,
          },
          withCredentials: true,
        },
      );

      if (response.data.success) {
        setAccounts([...accounts, response.data.data]);
        toast.success("Thêm nhân viên thành công");
      } else {
        toast.error(response.data.message || "Có lỗi xảy ra");
      }
      return response.data; // Return the response to be used by AddAccount
    } catch (error) {
      console.error("Error adding account:", error.response);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
      throw error; // Throw the error so AddAccount can catch it
    }
  };

  const handleUpdateAccount = (updatedAccount) => {
    setAccounts((prevAccounts) =>
      prevAccounts.map((account) =>
        account._id === updatedAccount._id ? updatedAccount : account,
      ),
    );
  };

  const openUpdateForm = (account) => {
    setSelectedAccount(account);
    setUpdateFormVisible(true);
  };

  return (
    <div className="flex items-center justify-center bg-gray-50">
      <div className="h-[600px] w-full max-w-7xl rounded-lg bg-white p-4 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Tìm kiếm bằng tên, email và vai trò"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-72 rounded-md border border-gray-300 p-2"
            />
            <span className="ml-8 pt-3 font-josefin text-2xl font-bold">
              Lọc:
            </span>
            <select
              className="ml-4 rounded-md border border-gray-300 p-2"
              value={selectedStatus || ""}
              onChange={(e) =>
                setSelectedStatus(
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
            >
              <option value="">Tất cả</option>
              <option value="2">Đang hoạt động</option>
              <option value="1">Tắt hoạt động</option>
            </select>
          </div>

          <div className="group relative">
            <button
              onClick={() => setAddFormVisible(true)}
              className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <span className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-gray-800 px-4 py-2 text-sm text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              Tạo tài khoản
            </span>
          </div>
        </div>
        {loading ? (
          // Hiển thị phần loading nếu dữ liệu chưa được tải
          <div className="flex h-[255px] w-full items-center justify-center lg:h-[300px]">
            <Loading /> {/* Hiển thị Loading khi đang tải dữ liệu */}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-md">
            {/* Phần tiêu đề cố định */}
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="w-[110px] px-4 py-3 text-center">
                    Tên người dùng
                  </th>
                  <th className="w-[100px] px-4 py-3 text-center">
                    Số điện thoại
                  </th>
                  <th className="w-[220px] px-4 py-3 text-center">Gmail</th>
                  <th className="w-[100px] px-4 py-3 text-center">Vai trò</th>
                  <th className="w-[100px] px-4 py-3 text-center">
                    Ngày cập nhật
                  </th>
                  <th className="w-[100px] px-4 py-3 text-center">Hoạt động</th>
                  <th className="w-[100px] px-4 py-3 text-center">Chỉnh sửa</th>
                </tr>
              </thead>
            </table>

            {/* Phần nội dung cuộn */}
            <div className="max-h-[470px] overflow-y-auto">
              <table className="min-w-full table-auto">
                <tbody>
                  {filteredAccounts.map((account) => (
                    <tr key={account._id} className="border-b">
                      <td className="w-[160px] px-4 py-6 text-center font-bold">
                        {account.username}
                      </td>
                      <td className="w-[170px] px-4 py-6 text-center">
                        {account.numbers}
                      </td>
                      <td className="w-[160px] px-4 py-6 text-center">
                        {account.gmail}
                      </td>
                      <td className="w-[160px] px-4 py-6 text-center">
                        {account.role}
                      </td>
                      <td className="w-[160px] px-4 py-6 text-center">
                        {new Date(account.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="w-[160px] px-4 py-6 text-center text-2xl">
                        <div className="group relative">
                          <FontAwesomeIcon
                            icon={
                              account.isActive === 2 ? faToggleOn : faToggleOff
                            }
                            className={
                              account.isActive === 2
                                ? "cursor-pointer text-green-500"
                                : "cursor-pointer text-gray-400"
                            }
                            onClick={() => toggleIsActive(account._id)}
                          />
                          <span className="absolute left-[-80%] top-1/2 -translate-y-1/2 transform whitespace-nowrap rounded-md bg-gray-800 px-2 py-2 text-sm text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                            Bật hoạt động
                          </span>
                        </div>
                      </td>
                      <td className="w-[160px] px-4 py-6 text-center text-xl">
                        <div className="group relative">
                          <button
                            onClick={() => openUpdateForm(account)}
                            className="rounded-full px-3 py-1 text-blue-400 hover:bg-slate-300"
                          >
                            <FontAwesomeIcon icon={faPen} />
                          </button>
                          <span className="absolute left-[-50%] top-1/2 -translate-y-1/2 transform whitespace-nowrap rounded-md bg-gray-800 px-2 py-2 text-sm text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
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

      {isAddFormVisible && (
        <AddAccount
          onClose={() => setAddFormVisible(false)}
          onAddAccount={handleAddAccount}
        />
      )}

      {isUpdateFormVisible && (
        <UpdateAccount
          account={selectedAccount}
          onClose={() => setUpdateFormVisible(false)}
          onUpdateAccount={handleUpdateAccount}
        />
      )}
    </div>
  );
};

export default ManageAccount;
