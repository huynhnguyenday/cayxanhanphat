const MapWithCards = () => {
  return (
    <div className="mx-auto mt-5 px-2 lg:w-[1200px] lg:px-0">
      <div className="row flex flex-wrap">
        {/* Tiêu đề */}
        <div className="mb-6 w-full">
          <h2 className="mt-10 text-center font-josefin text-4xl font-bold text-[#633c02] lg:text-5xl">
            Danh sách cửa hàng
          </h2>
        </div>

        {/* Trái: Thông tin liên hệ | Phải: Bản đồ */}
        <div className="flex w-full flex-col gap-6 pb-32 pt-6 md:flex-row">
          {/* Ô thông tin bên trái */}
          <div className="flex h-[550px] w-full flex-col items-center justify-center bg-[#f7f6f6] p-6 text-center shadow md:w-1/3">
            <h3 className="mb-4 font-oswald text-2xl font-bold text-[#633c02]">
              Thông tin liên hệ
            </h3>
            <div className="space-y-5 pt-2 font-josefin text-[18px] text-[#333]">
              <p>
                <span className="font-semibold text-[#633c02]">Địa chỉ:</span>
                <br />
                <span className="text-[16px] leading-tight text-[#00864a]">
                  70 Đường số 52, An Phú,TP Thủ Đức,TP Hồ Chí Minh.
                </span>
              </p>
              <p>
                <span className="font-semibold text-[#633c02]">
                  Số điện thoại:
                </span>
                <br />
                <span className="text-[16px] leading-tight text-[#00864a]">
                  0938 160 177
                </span>
              </p>
              <p>
                <span className="font-semibold text-[#633c02]">Email:</span>
                <br />
                <span className="text-[16px] leading-tight text-[#00864a]">
                  email@gmail.com
                </span>
              </p>
              <p>
                <span className="font-semibold text-[#633c02]">
                  Thời gian làm việc:
                </span>
                <br />
                <span className="text-[16px] leading-tight text-[#00864a]">
                  7AM - 10PM tất cả các ngày
                </span>
              </p>
            </div>
          </div>

          {/* Bản đồ bên phải */}
          <div className="w-full md:w-2/3">
            <div className="map-container h-[550px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d979.8369428384818!2d106.74969386955267!3d10.78465379933529!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317525002e74bee9%3A0x9e5b8e86f516257d!2zQ8OieSBj4bqjbmggQW4gUGjDoXQ!5e0!3m2!1svi!2s!4v1760024184174!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapWithCards;
