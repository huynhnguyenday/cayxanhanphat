import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVanShuttle,
  faMoneyBill,
  faTicket,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

const Benefit = () => {
  return (
    <div className="my-24 bg-white">
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-0">
        {/* Ô 1 */}
        <div className="flex h-[100px] w-[325px] items-center justify-start border border-white bg-[#f3f2f2] pl-10">
          <FontAwesomeIcon
            className="mr-4 text-[30px] text-[#00864a]"
            icon={faVanShuttle}
          />
          <div className="flex flex-col">
            <h6 className="mb-1 font-oswald text-[20px] font-bold text-black">
              Giao hàng miễn phí
            </h6>
            <p className="font-josefin text-[15px] text-black">
              Chỉ giao trong nội thành
            </p>
          </div>
        </div>

        {/* Ô 2 */}
        <div className="flex h-[100px] w-[325px] items-center justify-start border border-white bg-[#f3f2f2] pl-10">
          <FontAwesomeIcon
            className="mr-4 text-[30px] text-[#00864a]"
            icon={faMoneyBill}
          />
          <div className="flex flex-col">
            <h6 className="mb-1 font-oswald text-[20px] font-bold text-black">
              Thanh toán tiền mặt
            </h6>
            <p className="font-josefin text-[15px] text-black">
              Thanh toán khi nhận hàng
            </p>
          </div>
        </div>

        {/* Ô 3 */}
        <div className="flex h-[100px] w-[325px] items-center justify-start border border-white bg-[#f3f2f2] pl-10">
          <FontAwesomeIcon
            className="mr-4 text-[30px] text-[#00864a]"
            icon={faTicket}
          />
          <div className="flex flex-col">
            <h6 className="mb-1 font-oswald text-[20px] font-bold text-black">
              Khuyến mãi hấp dẫn
            </h6>
            <p className="font-josefin text-[15px] text-black">
              Ngày mới khuyến mãi mới
            </p>
          </div>
        </div>

        {/* Ô 4 */}
        <div className="flex h-[100px] w-[325px] items-center justify-start border border-white bg-[#f3f2f2] pl-10">
          <FontAwesomeIcon
            className="mr-4 text-[30px] text-[#00864a]"
            icon={faClock}
          />
          <div className="flex flex-col">
            <h6 className="mb-1 font-oswald text-[20px] font-bold text-black">
              Mở cửa 24/7
            </h6>
            <p className="font-josefin text-[15px] text-black">
              Mở cửa kể cả dịp lễ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Benefit;
