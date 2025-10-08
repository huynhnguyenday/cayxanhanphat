import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapLocationDot,
  faPlaneDeparture,
} from "@fortawesome/free-solid-svg-icons";
import address1 from "../../assets/address1.png";
import address2 from "../../assets/address2.png";
import address3 from "../../assets/address3.png";
import address4 from "../../assets/address4.png";
import address5 from "../../assets/address5.png";

const MapWithCards = () => {
  // Địa chỉ và URL bản đồ cho mỗi Card
  const locations = [
    {
      name: "Bamos Lã Xuân Oai",
      address: "74A Lã Xuân Oai, Tăng Nhơn Phú A, Quận 9",
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.5770941066426!2d106.78598437480595!3d10.843640489309246!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527e1c97281c1%3A0x6828cef66ea104f4!2zQmFtb3MgQ29mZmVlIC0gTMOjIFh1w6JuIE9haSwgVGjhu6cgxJDhu6ljIChPcGVuIDI0Lzcp!5e0!3m2!1svi!2s!4v1732093971490!5m2!1svi!2s",
      imageUrl: address1,
    },
    {
      name: "Bamos Trần Não",
      address: "9/8 Đường số 10, Phường An Khánh, Quận 2",
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.2029311844135!2d106.72984707480525!3d10.79576398935416!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752786a7cc97cb%3A0xcc30c86bab2eab29!2zQmFtb3MgQ29mZmVlIC0gVHLhuqduIE7Do28!5e0!3m2!1svi!2s!4v1732094237937!5m2!1svi!2s",
      imageUrl: address2,
    },
    {
      name: "Bamos Lê Văn Việt",
      address: "448/18 Lê Văn Việt, Phường Tăng Nhơn Phú A, Thủ Đức",
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.6057354554378!2d106.79328627480595!3d10.841453989311264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175272fd8af39d3%3A0xe785c13663b17b13!2zQmFtb3MgQ29mZmVlIC0gTMOqIFbEg24gVmnhu4d0LCBUaOG7pyDEkOG7qWM!5e0!3m2!1svi!2s!4v1732094973193!5m2!1svi!2s",
      imageUrl: address3,
    },
    {
      name: "Bamos Dương Quảng Hàm",
      address: "496/38 Dương Quảng Hàm, Phường 6, Quận Gò Vấp",
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.6631018462567!2d106.68253437480575!3d10.837073289315391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f96d059283f%3A0xd38b0f9f28748d3f!2zQmFtb3MgQ29mZmVlIC0gRMawxqFuZyBRdeG6o25nIEjDoG0sIEfDsiBW4bqlcCAoT3BlbiAyNC83KQ!5e0!3m2!1svi!2s!4v1732098578369!5m2!1svi!2s",
      imageUrl: address4,
    },
    {
      name: "Bamos Ngô Tất Tố",
      address: "69 Đ. Ng. Tất Tố, Phường 21, Bình Thạnh",
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.2374631234034!2d106.70913447480525!3d10.79311618935667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529ed340f2d7d%3A0xa06142ab255e4fd9!2zQmFtb3MgQ29mZmVlIC0gTmfDtCBU4bqldCBU4buRLCBCw6xuaCBUaOG6oW5oIChPcGVuIDI0Lzcp!5e0!3m2!1svi!2s!4v1732098425245!5m2!1svi!2s",
      imageUrl: address5,
    },
  ];

  // Trạng thái URL của bản đồ (khi hover)
  const [mapUrl, setMapUrl] = useState(locations[0].mapUrl);

  // Bộ lọc quận
  const [districtFilter, setDistrictFilter] = useState("");

  const filteredLocations = locations.filter((location) => {
    if (districtFilter === "") return true; // Hiển thị tất cả nếu không chọn
    if (districtFilter === "Thủ Đức") {
      return (
        location.address.includes("Thủ Đức") ||
        location.address.includes("Quận 2") ||
        location.address.includes("Quận 9")
      );
    }
    return location.address.includes(districtFilter);
  });

  return (
    <div className="mx-auto mt-5 px-2 lg:w-[1200px] lg:px-0">
      <div className="row flex flex-wrap">
        {/* Tiêu đề danh sách cửa hàng */}
        <div className="mb-3 w-full">
          <h2 className="mt-10 text-center font-oswald text-[34px] font-bold text-[#633c02]">
            Danh sách cửa hàng
          </h2>
        </div>

        {/* Bộ lọc quận và Tìm cửa hàng */}
        <div className="mb-3 flex w-full items-center justify-between">
          <div className="flex items-center">
            <span className="h-full cursor-pointer font-josefin text-[24px] text-lg">
              Tìm cửa hàng:
            </span>
            <p className="h-full cursor-pointer pl-[17px] font-josefin text-[32px]">
              <FontAwesomeIcon icon={faMapLocationDot} />
            </p>
            <select
              className="form-select ml-[17px] !w-[175px] border border-[#888] p-2"
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
            >
              <option value="">Chọn quận</option>
              <option value="Bình Thạnh">Bình Thạnh</option>
              <option value="Gò Vấp">Gò Vấp</option>
              <option value="Thủ Đức">Thành Phố Thủ Đức</option>
            </select>
          </div>
        </div>

        {/* Phần bên trái: Danh sách các địa chỉ */}
        <div className="w-full md:w-1/3">
          <div className="card-list mb-[6rem] max-h-[550px] overflow-x-hidden overflow-y-scroll">
            <style>
              {`
                .card-list::-webkit-scrollbar {
                  width: 6px;
                }
                .card-list::-webkit-scrollbar-thumb {
                  background-color: #888;
                  border-radius: 10px;
                }
                .card-list::-webkit-scrollbar-thumb:hover {
                  background-color: #555;
                }
                .card-list::-webkit-scrollbar-track {
                  background-color: #f1f1f1;
                  border-radius: 10px;
                }
              `}
            </style>
            {filteredLocations.map((location, index) => (
              <div
                key={index}
                className="card mb-[5px] flex h-[150px] w-[400px] flex-row items-center border-none"
                onMouseEnter={() => setMapUrl(location.mapUrl)}
              >
                <div className="card-left mr-4 flex h-full w-24 shrink-0 grow-0 basis-[100px] items-center justify-center">
                  <img
                    className="h-full w-full rounded-md object-cover py-[7px]"
                    src={location.imageUrl}
                    alt={location.name}
                  />
                </div>
                <div className="flex-column card-body flex-1 justify-center">
                  <h5 className="m-0 w-[250px] font-oswald text-[19px] font-bold text-[#995c01]">
                    {location.name}
                  </h5>
                  <p className="m-0 w-[250px] pt-2 font-josefin text-[#666]">
                    <FontAwesomeIcon icon={faMapLocationDot} />{" "}
                    {location.address}
                  </p>
                  <p className="m-0 w-[250px] pt-4 font-josefin text-[#666]">
                    <FontAwesomeIcon icon={faPlaneDeparture} /> Xem địa chỉ
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phần bên phải: Bản đồ Google Maps */}
        <div className="w-full md:w-2/3">
          <div className="map-container h-[550px]">
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: "0", marginLeft: "5px" }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapWithCards;
