import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PricingContentNew from "./PricingContentNew";
import PricingContentMenu from "./PricingContentMenu";

const NavbarLink = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // Mobile nếu width < 1024px
    };

    handleResize(); // Chạy ngay khi load
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full">
      <ul className="navbar-links flex flex-col items-start justify-center sm:flex-row sm:space-x-8 sm:space-y-0 sm:pl-8">
        <li className="w-full border-t-[1px] border-gray-200 py-4 sm:w-max sm:border-none sm:py-0">
          <FlyoutLink href="/home" isMobile={isMobile}>
            TRANG CHỦ
          </FlyoutLink>
        </li>
        <li className="w-full border-b-[1px] border-t-[1px] border-gray-200 py-4 sm:w-max sm:border-none sm:py-0">
          <FlyoutLink
            href="/menu"
            FlyoutContent={PricingContentMenu}
            isMobile={isMobile}
          >
            SẢN PHẨM 
          </FlyoutLink>
        </li>
        <li className="w-full border-b-[1px] border-gray-200 py-4 sm:w-max sm:border-none sm:py-0">
          <FlyoutLinkNews
            href="/news"
            FlyoutContent={PricingContentNew}
            isMobile={isMobile}
          >
            TIN TỨC
          </FlyoutLinkNews>
        </li>
        <li className="w-full border-b-[1px] border-gray-200 py-4 sm:w-max sm:border-none sm:py-0">
          <FlyoutLink href="/address" isMobile={isMobile}>
            ĐỊA CHỈ
          </FlyoutLink>
        </li>
      </ul>
    </div>
  );
};

const FlyoutLink = ({ children, href, FlyoutContent, isMobile }) => {
  const [open, setOpen] = useState(false);
  const showFlyout = FlyoutContent && open && !isMobile; // Ẩn trên mobile

  const closeFlyout = () => setOpen(false);

  return (
    <div
      onMouseEnter={() => !isMobile && setOpen(true)}
      onMouseLeave={() => !isMobile && setOpen(false)}
      className="relative"
    >
      <a
        href={href}
        className="inline px-8 font-oswald font-semibold text-black transition-colors duration-300 hover:text-[#d88453]"
      >
        {children}
      </a>
      <AnimatePresence>
        {showFlyout && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            style={{ translateX: "-45%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute left-1/2 top-[52px] w-[1200px] rounded-3xl bg-white text-black shadow-lg"
          >
            <FlyoutContent closeFlyout={closeFlyout} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FlyoutLinkNews = ({ children, href, FlyoutContent, isMobile }) => {
  const [open, setOpen] = useState(false);
  const showFlyout = FlyoutContent && open && !isMobile; // Ẩn trên mobile

  const closeFlyout = () => setOpen(false);

  return (
    <div
      onMouseEnter={() => !isMobile && setOpen(true)}
      onMouseLeave={() => !isMobile && setOpen(false)}
      className="relative"
    >
      <a
        href={href}
        className="inline px-8 font-oswald font-semibold text-black transition-colors duration-300 hover:text-[#d88453]"
      >
        {children}
      </a>
      <AnimatePresence>
        {showFlyout && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            style={{ translateX: "calc(-48% - 140px)" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute left-1/2 top-[52px] w-[1200px] rounded-3xl bg-white text-black shadow-lg"
          >
            <FlyoutContent closeFlyout={closeFlyout} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavbarLink;
