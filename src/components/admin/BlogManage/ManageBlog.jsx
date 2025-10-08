import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPen,
  faTrash,
  faFire,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import AddBlog from "./AddBlog";
import UpdateBlog from "./UpdateBlog";
import Loading from "../../website/Loading";

const ManageBlog = () => {
  const [blogList, setBlogList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddFormVisible, setAddFormVisible] = useState(false);
  const [isEditFormVisible, setEditFormVisible] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [displayHotFilter, setDisplayHotFilter] = useState("all");
  const [displayTypeFilter, setDisplayTypeFilter] = useState("all");

  // Lọc blog dựa trên từ khóa tìm kiếm
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://cayxanhanphatbe-production.up.railway.app/api/blogs",
        );
        setBlogList(response.data.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleEditClick = (blog) => {
    setSelectedBlog(blog);
    setEditFormVisible(true);
  };

  const formatDate = (timestamp) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(timestamp).toLocaleDateString("en-GB", options);
  };

  // Lọc các blog dựa trên các bộ lọc
  const filteredBlogs = blogList.filter((blog) => {
    const matchesSearchTerm = blog.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesHotFilter =
      displayHotFilter === "all" ||
      (displayHotFilter === "1" && blog.displayHot === 1) ||
      (displayHotFilter === "2" && blog.displayHot === 2);
    const matchesBannerFilter =
      displayTypeFilter === "all" ||
      (displayTypeFilter === "1" && blog.displayBanner === 1) ||
      (displayTypeFilter === "2" && blog.displayBanner === 2);

    return matchesSearchTerm && matchesHotFilter && matchesBannerFilter;
  });

  // Reset filters to show all
  const resetFilters = () => {
    setDisplayHotFilter("all");
    setDisplayTypeFilter("all");
  };

  const toggleDisplayHot = async (id) => {
    try {
      // Cập nhật trạng thái local
      const updatedBlogs = blogList.map((blog) =>
        blog._id === id
          ? { ...blog, displayHot: blog.displayHot === 1 ? 2 : 1 }
          : blog,
      );
      setBlogList(updatedBlogs);

      // Gửi yêu cầu API để cập nhật trạng thái trên server
      await axios.put(`https://cayxanhanphatbe-production.up.railway.app/api/blogs/${id}`, {
        displayHot: updatedBlogs.find((blog) => blog._id === id).displayHot,
      });
    } catch (error) {
      console.error("Error updating display hot:", error);

      // Khôi phục trạng thái ban đầu nếu có lỗi
      setBlogList((prev) =>
        prev.map((blog) =>
          blog._id === id
            ? { ...blog, displayHot: blog.displayHot === 2 ? 1 : 2 }
            : blog,
        ),
      );
    }
  };

  const toggleDisplayBanner = async (id) => {
    try {
      // Cập nhật trạng thái local
      const updatedBlogs = blogList.map((blog) =>
        blog._id === id
          ? { ...blog, displayBanner: blog.displayBanner === 1 ? 2 : 1 }
          : blog,
      );
      setBlogList(updatedBlogs);

      // Gửi yêu cầu API để cập nhật trạng thái trên server
      await axios.put(`https://cayxanhanphatbe-production.up.railway.app/api/blogs/${id}`, {
        displayBanner: updatedBlogs.find((blog) => blog._id === id)
          .displayBanner,
      });
    } catch (error) {
      console.error("Error updating display banner:", error);

      // Khôi phục trạng thái ban đầu nếu có lỗi
      setBlogList((prev) =>
        prev.map((blog) =>
          blog._id === id
            ? { ...blog, displayBanner: blog.displayBanner === 2 ? 1 : 2 }
            : blog,
        ),
      );
    }
  };

  const truncateHTMLContent = (htmlContent, wordLimit) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";
    const words = textContent.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : textContent;
  };

  return (
    <div className="flex items-center justify-center bg-gray-50">
      <div className="h-[600px] w-full max-w-7xl rounded-lg bg-white p-6 shadow-lg">
        {/* Search and Add Blog */}
        <div className="mb-4 flex items-center justify-between">
          {/* Thanh tìm kiếm */}
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Tìm kiếm bằng tiêu đề"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-60 rounded-md border border-gray-300 p-2"
            />
          </div>

          {/* Bộ lọc trạng thái Hot, Banner và Tất cả */}
          <div className="flex items-center space-x-4">
            {/* Bộ lọc trạng thái Hot */}
            <select
              className="rounded-md border border-gray-300 p-2"
              value={displayHotFilter}
              onChange={(e) => setDisplayHotFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái Hot</option>
              <option value="1">Hot</option>
              <option value="2">Không Hot</option>
            </select>

            {/* Bộ lọc trạng thái Banner */}
            <select
              className="rounded-md border border-gray-300 p-2"
              value={displayTypeFilter}
              onChange={(e) => setDisplayTypeFilter(e.target.value)}
            >
              <option value="all">Tất cả Banner</option>
              <option value="1">Bật Banner</option>
              <option value="2">Tắt Banner</option>
            </select>

            {/* Reset Filters Button */}
            <button
              onClick={resetFilters}
              className="rounded-md bg-gray-500 px-4 pb-1 pt-3 font-josefin text-xl text-white transition-transform duration-200 hover:scale-90"
            >
              Tất cả
            </button>
          </div>

          {/* Nút thêm Blog */}
          <div className="group relative">
            <button
              onClick={() => setAddFormVisible(true)}
              className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <span className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-gray-800 px-4 py-2 text-sm text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              Tạo bài viết
            </span>
          </div>
        </div>

        {loading ? (
          // Hiển thị phần loading nếu dữ liệu chưa được tải
          <div className="flex h-[255px] w-full items-center justify-center lg:h-[200px]">
            <Loading /> {/* Hiển thị Loading khi đang tải dữ liệu */}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="w-[130px] px-4 py-3 text-center">Ảnh</th>
                  <th className="w-[253px] px-4 py-3 text-center">Tiêu đề</th>
                  <th className="w-[253px] px-4 py-3 text-center">Nội dung</th>
                  <th className="w-[143px] px-4 py-3 text-center">Ngày</th>
                  <th className="px-4 py-3 text-center">Hot</th>
                  <th className="px-4 py-3 text-center">Banner</th>
                  <th className="px-4 py-3 text-center">Hành động</th>
                </tr>
              </thead>
            </table>
            <div className="max-h-[460px] overflow-y-auto">
              <table className="min-w-full table-auto">
                <tbody>
                  {filteredBlogs.map((blog) => (
                    <tr key={blog._id} className="border-b">
                      <td className="flex justify-center px-4 py-6 text-center">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="h-20 w-auto object-cover"
                        />
                      </td>
                      <td className="w-[253px] px-2 py-6 font-bold">
                        {blog.title}
                      </td>
                      <td className="w-[253px] px-4 py-6 text-left">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: truncateHTMLContent(blog.content, 10),
                          }}
                        ></div>
                      </td>

                      <td className="w-[133px] px-4 py-6 text-center">
                        {formatDate(blog.createdAt)}
                      </td>
                      <td className="w-[103px] px-4 py-2 text-center">
                        <div className="group relative">
                          <FontAwesomeIcon
                            icon={faFire}
                            className={
                              blog.displayHot === 1
                                ? "cursor-pointer text-2xl text-red-500"
                                : "cursor-pointer text-xl text-gray-400"
                            }
                            onClick={() => toggleDisplayHot(blog._id)}
                          />
                          <span className="absolute bottom-full left-1/2 mb-4 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-gray-800 px-2 py-2 text-sm text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                            Đặt làm Hot
                          </span>
                        </div>
                      </td>
                      <td className="w-[133px] px-4 py-2 text-center">
                        <div className="group relative">
                          <FontAwesomeIcon
                            icon={faLightbulb}
                            className={
                              blog.displayBanner === 1
                                ? "cursor-pointer text-3xl text-yellow-500"
                                : "cursor-pointer text-2xl text-gray-400"
                            }
                            onClick={() => toggleDisplayBanner(blog._id)}
                          />
                          <span className="absolute bottom-full left-1/2 mb-4 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-gray-800 px-2 py-2 text-sm text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                            Đặt làm Banner
                          </span>
                        </div>
                      </td>
                      <td className="w-[150px] px-4 py-6 text-center">
                        <div className="flex justify-center space-x-4 text-xl">
                          <div className="group relative">
                            <button
                              className="rounded-full px-3 py-1 text-blue-400 hover:bg-slate-300"
                              onClick={() => handleEditClick(blog)}
                            >
                              <FontAwesomeIcon icon={faPen} />
                            </button>
                            <span className="absolute bottom-full left-1/2 mb-4 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-gray-800 px-2 py-2 text-sm text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                              Chỉnh sửa
                            </span>
                          </div>
                          <div className="group relative">
                            <button className="rounded-md px-3 py-1 text-center text-red-400 hover:rounded-full hover:bg-slate-300">
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                            <span className="absolute bottom-full left-1/3 mb-4 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-gray-800 px-2 py-2 text-sm text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                              Xóa bài
                            </span>
                          </div>
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
        <AddBlog
          onClose={() => setAddFormVisible(false)}
          onBlogAdded={(newBlog) => setBlogList((prev) => [newBlog, ...prev])}
        />
      )}

      {isEditFormVisible && selectedBlog && (
        <UpdateBlog
          blog={selectedBlog}
          onClose={() => setEditFormVisible(false)}
          onBlogUpdated={(updatedBlog) => {
            setBlogList((prev) =>
              prev.map((blog) =>
                blog._id === updatedBlog._id ? updatedBlog : blog,
              ),
            );
          }}
        />
      )}
    </div>
  );
};

export default ManageBlog;
