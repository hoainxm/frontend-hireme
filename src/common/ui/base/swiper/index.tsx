import { Pagination, Navigation, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import React, { FC, HTMLAttributes, ReactElement, ReactNode, useRef } from 'react';
import style from './swiper.module.scss';
import { NavigationOptions, PaginationOptions } from 'swiper/types';

interface Props extends HTMLAttributes<HTMLDivElement> {
  isContrast?: boolean;
  navigation?: boolean | NavigationOptions;
  pagination?: PaginationOptions;
  typeActivePagination?: "dot" | "span",
  isInFrontSlide?: boolean;
  isLoop?: boolean;
  isAutoPlay?: boolean;
  isZoom?: boolean;
  autoPlayTimeDelay?: number;
  spaceBetween?: number;
  listSlide: Array<ReactNode | FC<any> | ReactElement>;
  className?: string;
}

export const CSwiper: FC<Props> = (props) => {
  const {
    isContrast = false,
    isInFrontSlide = false,
    isLoop = false,
    isAutoPlay = false,
    isZoom = false,
    autoPlayTimeDelay = 5000,
    spaceBetween = 0,
    listSlide,
    typeActivePagination = "span"
  } = props;

  const autoPlayConfig = isAutoPlay && {
    delay: autoPlayTimeDelay,
    disableOnInteraction: false,
  };

  const swiperRef = useRef<SwiperRef>(null);

  return (
    <Swiper
      ref={swiperRef}
      modules={[Navigation, Pagination, Scrollbar, Autoplay, A11y]}
      className={`${style.cswiper} ${props.className} ${props.navigation && style.navigation}`}
      centeredSlides={true}
      spaceBetween={spaceBetween}
      zoom={isZoom}
      allowTouchMove
      navigation={props.navigation}
      pagination={{
        clickable: true,
        bulletClass: style.dot,
        bulletActiveClass: `${style.dotActive} ${typeActivePagination === "span" && style.span} ${isContrast && style.isContrast}`,
        horizontalClass: `${isInFrontSlide ? style.isInFrontSlide : style.isBelowSlide}`,
        ...props.pagination
      }}
      loop={isLoop}
      autoplay={autoPlayConfig}
    >
      {listSlide.map((slide, index) => (
        <SwiperSlide key={index}>{slide}</SwiperSlide>
      ))}
    </Swiper>
  );
};
