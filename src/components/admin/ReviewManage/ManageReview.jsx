import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faPen,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Loading from "../../../components/website/Loading";

const ManageReview = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState(null);

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://cayxanhanphatbe-production.up.railway.app/api/reviews",
        );
        console.log("Reviews data:", response.data.data);
        setReviews(response.data.data); // Gán dữ liệu từ API
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error.message);
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Toggle trạng thái đánh giá (hiển thị hoặc ẩn)
  const toggleActiveReview = async (reviewId) => {
    try {
      // Cập nhật trạng thái activeReview cho mỗi review
      const updatedReviews = reviews.map((review) =>
        review._id === reviewId
          ? { ...review, activeReview: review.activeReview === 1 ? 2 : 1 }
          : review,
      );
      setReviews(updatedReviews); // Cập nhật lại state reviews

      // Gửi yêu cầu cập nhật trạng thái đến API
      await axios.put(
        `https://cayxanhanphatbe-production.up.railway.app/api/reviews/${reviewId}`,
        {
          activeReview: updatedReviews.find((r) => r._id === reviewId)
            .activeReview,
        },
      );
    } catch (error) {
      console.error("Error updating active review:", error);
    }
  };

  // Lọc đánh giá theo từ khóa
  const filteredReviews = reviews.filter(
    (review) =>
      (selectedRating === null || review.rate === selectedRating) &&
      (review.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.email.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="flex items-center justify-center bg-gray-50">
      <div className="h-[600px] w-full max-w-full rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center">
          <input
            type="text"
            placeholder="Tìm kiếm bằng tên sản phẩm hoặc tên người đánh giá"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-2/5 rounded-md border border-gray-300 p-2"
          />
          <span className="ml-8 pt-3 font-josefin text-2xl font-bold">
            Lọc:
          </span>
          <select
            className="ml-4 rounded-md border border-gray-300 p-2"
            value={selectedRating || ""}
            onChange={(e) =>
              setSelectedRating(
                e.target.value === "" ? null : Number(e.target.value),
              )
            }
          >
            <option value="">Tất cả</option>
            {[1, 2, 3, 4, 5].map((rating) => (
              <option key={rating} value={rating}>
                {rating} ⭐
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto rounded-lg shadow-md">
          {loading ? (
            <Loading />
          ) : (
            <>
              {/* Tiêu đề bảng cố định */}
              <table className="min-w-full table-auto">
                <thead className="sticky top-0 z-10 bg-gray-100">
                  <tr>
                    <th className="w-[350px] px-4 py-3 text-left">
                      Tên sản phẩm
                    </th>
                    <th className="w-[250px] px-4 py-3 text-left">Tên</th>
                    <th className="w-[170px] px-4 py-3 text-left">Ngày</th>
                    <th className="w-[100px] px-4 py-3 text-left">Rate</th>
                    <th className="w-[100px] px-4 py-3 text-center">
                      Hiển thị
                    </th>
                    <th className="w-[100px] px-4 py-3 text-center">
                      Hành động
                    </th>
                  </tr>
                </thead>
              </table>

              {/* Nội dung cuộn */}
              <div className="max-h-[430px] overflow-y-auto">
                <table className="min-w-full table-auto">
                  <tbody>
                    {filteredReviews.map((review) => (
                      <tr key={review._id} className="border-b">
                        <td className="h-100px line-clamp-2 w-[300px] px-4 pb-3 pt-9 text-left font-bold">
                          {review.product.name}
                        </td>
                        <td className="w-[300px] px-4 py-8 text-left font-bold">
                          {review.name}
                        </td>
                        <td className="w-[150px] px-4 py-8 text-left">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </td>
                        <td className="w-[150px] px-4 py-8 text-center">
                          {review.rate}⭐
                        </td>
                        <td className="w-[100px] px-4 py-8 text-center">
                          <FontAwesomeIcon
                            icon={
                              review.activeReview === 1 ? faEye : faEyeSlash
                            }
                            className={
                              review.activeReview === 1
                                ? "cursor-pointer text-2xl text-blue-500"
                                : "cursor-pointer text-xl text-gray-400"
                            }
                            onClick={() => toggleActiveReview(review._id)}
                          />
                        </td>
                        <td className="w-[100px] px-4 py-2 text-center">
                          <button
                            onClick={() => setSelectedReview(review)}
                            className="rounded-full px-3 py-1 text-2xl text-blue-500 hover:bg-gray-200"
                          >
                            <FontAwesomeIcon icon={faPen} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {selectedReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="relative w-full max-w-5xl rounded-lg bg-white p-6 shadow-lg">
              <button
                onClick={() => setSelectedReview(null)}
                className="absolute right-5 top-3 text-4xl text-gray-400 hover:text-black"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
              <h2 className="mb-8 text-center text-5xl font-bold">
                Chi tiết bình luận
              </h2>
              <form>
                <div className="flex space-x-6">
                  <div className="w-1/2 pl-10">
                    <label className="mb-2 block font-josefin text-2xl font-bold">
                      Tên người đánh giá
                    </label>
                    <p className="mb-8 rounded-md border border-gray-300 p-2">
                      {selectedReview.name}
                    </p>
                    <label className="mb-2 block font-josefin text-2xl font-bold">
                      Email
                    </label>
                    <p className="mb-8 rounded-md border border-gray-300 p-2">
                      {selectedReview.email}
                    </p>
                    <label className="mb-2 block font-josefin text-2xl font-bold">
                      Ngày đánh giá
                    </label>
                    <p className="mb-4 w-1/3 rounded-md border border-gray-300 p-2">
                      {new Date(selectedReview.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="w-2/3 pl-10">
                    <label className="mb-2 block font-josefin text-2xl font-bold">
                      Đánh giá
                    </label>
                    <div className="mb-8 ml-4 flex">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <span
                          key={num}
                          className={`cursor-pointer text-4xl ${
                            num <= selectedReview.rate
                              ? "text-yellow-500"
                              : "text-black"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <label className="mb-2 block font-josefin text-2xl font-bold">
                      Nội dung đánh giá
                    </label>
                    <textarea
                      readOnly
                      className="mb-4 h-56 max-h-96 w-full overflow-y-auto rounded-md border border-gray-300 p-2"
                    >
                      {selectedReview.content}
                    </textarea>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageReview;
