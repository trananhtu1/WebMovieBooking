import React from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { image500, image780 } from '../../server/api/MovieDB';

export default function TrendingMovies({ title, data }) {
  const navigate = useNavigate();

  const handleClick = (item) => {
    navigate(`/movie/${item.id}`, { state: { movie: item } });
  };

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  return (
    <div className="mb-8">
      <h2 className="text-white text-xl mx-4 mb-5">{title}</h2>
      <Carousel
        responsive={responsive}
        infinite={true}
        keyBoardControl={true}
        containerClass="carousel-container"
        itemClass="carousel-item-padding-40-px"
        autoPlay={false}
        renderDotsOutside={true}
      >
        {data.map((item) => (
          <MovieCard key={item.id} item={item} handleClick={handleClick} />
        ))}
      </Carousel>
    </div>
  );
}

const MovieCard = ({ item, handleClick }) => {
  return (
    <div
      className="rounded-3xl overflow-hidden cursor-pointer"
      onClick={(e) => {
        e.preventDefault(); // Ngăn việc làm mới trang
        handleClick(item);
      }}
    >
      <img
        src={image500(item.poster_path)}
        alt={item.title || item.name}
        className="w-full h-full object-cover"
        style={{
          width: '280px',
          height: '400px',
        }}
      />
    </div>
  );
};
