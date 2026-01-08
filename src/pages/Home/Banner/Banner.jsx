import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import banner1 from "../../../assets/img/banner/banner1.png";
import banner2 from "../../../assets/img/banner/banner2.png";
import banner3 from "../../../assets/img/banner/banner3.png";

const Banner = () => {
  return (
    <div className="w-full relative z-0">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="h-screen z-0"
      >
        {/* Slide 1 */}
        <SwiperSlide>
          <img
            src={banner1}
            className="w-full h-full object-cover"
            alt="Banner 1"
          />
        </SwiperSlide>

        {/* Slide 2 */}
        <SwiperSlide>
          <img
            src={banner2}
            className="w-full h-full object-cover"
            alt="Banner 2"
          />
        </SwiperSlide>

        {/* Slide 3 */}
        <SwiperSlide>
          <img
            src={banner3}
            className="w-full h-full object-cover"
            alt="Banner 3"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Banner;