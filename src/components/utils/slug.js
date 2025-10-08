//components/utils/slug.js
export const createSlug = (name) => {
  const removeVietnameseTones = (str) => {
    return str
      .normalize("NFD") // Chuẩn hóa Unicode thành dạng tổ hợp ký tự
      .replace(/[\u0300-\u036f]/g, "") // Loại bỏ các dấu tổ hợp
      .replace(/đ/g, "d") // Chuyển 'đ' thành 'd'
      .replace(/Đ/g, "D"); // Chuyển 'Đ' thành 'D'
  };

  return removeVietnameseTones(name) // Loại bỏ dấu tiếng Việt
    .toLowerCase() // Chuyển thành chữ thường
    .trim() // Loại bỏ khoảng trắng ở đầu và cuối
    .replace(/[^a-z0-9\s-]/g, "") // Loại bỏ ký tự đặc biệt, giữ lại chữ cái, số, khoảng trắng, và dấu '-'
    .replace(/[\s]+/g, "-"); // Thay khoảng trắng bằng dấu '-'
};
