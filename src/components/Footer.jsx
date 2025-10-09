import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", delay: i * 0.1 },
    }),
  };

  return (
    <footer
      className="font-josefin-sans bg-white text-black"
      style={{ height: "250px" }}
    >
      <div className="mx-auto w-full px-2 pt-8 lg:px-6">
        <div className="mx-auto max-w-full lg:w-[1200px]">
          <div className="flex flex-wrap items-start justify-between">
            {/* Left Section */}
            <motion.div
              className="mb-6 w-full sm:mb-0 sm:w-1/3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
              variants={itemVariants}
            >
              <h2 className="mb-4 font-oswald text-4xl font-bold text-[#633c02]">
                CÂY CẢNH <span className="text-[#00864a]">AN PHÁT</span>
              </h2>
              <p className="font-josefin text-base leading-relaxed">
                Cây Cảnh An Phát là điểm đến cho những ai yêu thiên nhiên và
                muốn mang sắc xanh vào không gian sống. Với đa dạng các loại cây
                được chăm sóc tỉ mỉ, chúng tôi mang đến sự lựa chọn phong phú
                cho mọi nhu cầu. Không chỉ là nơi mua sắm cây cảnh, An Phát còn
                mang đến cảm giác thư giãn và lan tỏa niềm vui xanh đến mọi
                người.
              </p>
            </motion.div>

            {/* Center Section */}
            <motion.div
              className="mb-6 w-full text-center sm:mb-0 sm:w-1/3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              variants={itemVariants}
            >
              <h2 className="underline-title mb-4 text-3xl font-bold text-[#633c02]">
                Về chúng tôi
              </h2>
              <div className="mx-auto my-4 h-1 w-12 bg-[#633c02]"></div>
              <ul className="fw-semibold space-y-2 font-josefin text-xl">
                <motion.li variants={itemVariants} custom={2}>
                  <a
                    href="/menu"
                    className="transition-colors hover:text-[#d88453]"
                  >
                    Sản phẩm
                  </a>
                </motion.li>
                <motion.li variants={itemVariants} custom={3}>
                  <a
                    href="/news"
                    className="transition-colors hover:text-[#d88453]"
                  >
                    Tin tức
                  </a>
                </motion.li>
                <motion.li variants={itemVariants} custom={4}>
                  <a
                    href="/address"
                    className="transition-colors hover:text-[#d88453]"
                  >
                    Địa chỉ
                  </a>
                </motion.li>
              </ul>
            </motion.div>

            {/* Right Section */}
            <motion.div
              className="w-full text-right sm:w-1/3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={5}
              variants={itemVariants}
            >
              <h2 className="mb-4 text-center text-3xl font-bold text-[#633c02] lg:pl-[110px]">
                Liên hệ
              </h2>
              <div className="mb-4 flex justify-center space-x-4 sm:justify-end">
                {[
                  { icon: faFacebook, link: "https://facebook.com" },
                  { icon: faInstagram, link: "https://instagram.com" },
                  { icon: faTwitter, link: "https://twitter.com" },
                  { icon: faTiktok, link: "https://tiktok.com" },
                ].map((social, index) => (
                  <motion.div
                    key={index}
                    className="group relative inline-block"
                    variants={itemVariants}
                    custom={6 + index}
                  >
                    <a
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-gray-100 text-2xl text-black transition-transform duration-300 ease-in-out hover:scale-110 hover:text-[#d88453]"
                    >
                      <FontAwesomeIcon icon={social.icon} />
                    </a>
                    <span className="absolute bottom-[125%] left-1/2 hidden w-[120px] -translate-x-1/2 rounded bg-gray-800 p-2 text-center text-base text-white opacity-0 transition-opacity duration-300 group-hover:block group-hover:opacity-100">
                      Follow on {social.icon.iconName}
                    </span>
                  </motion.div>
                ))}
              </div>
              <motion.p
                className="pb-2 pt-14 font-josefin text-base font-bold text-[#633c02] lg:pb-6"
                variants={itemVariants}
                custom={10}
              >
                © 2024 CÂY CẢNH
                <span className="text-[#00864a]"> AN PHÁT</span>.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
