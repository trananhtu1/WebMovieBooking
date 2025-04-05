import React from 'react';
import { useNavigate } from 'react-router-dom';
import { fallbackMoviePoster, image185 } from '../../server/api/MovieDB';

export default function MovieList({ title, hideSeeAll, data }) {
  const navigate = useNavigate();

  return (
    <div className="mb-8 space-y-4">
      {/* Tiêu đề và nút See All */}
      <div className="flex justify-between items-center mx-4">
        <h2 className="text-blue-600 text-lg">{title}</h2>
        {!hideSeeAll && (
          <button
            onClick={() => navigate('/movies')}
            className="text-blue-600 text-lg hover:underline"
          >
            See All
          </button>
        )}
      </div>

      {/* Danh sách phim */}
      <div className="flex overflow-x-scroll no-scrollbar px-4 space-x-4">
        {data.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(`/movie/${item.id}`, { state: item })}
            className="flex-shrink-0 space-y-2 cursor-pointer"
          >
            <img
              src={image185(item.poster_path) || fallbackMoviePoster}
              alt={item.title || 'Unknown'}
              className="rounded-3xl w-[120px] h-[180px] object-cover"
            />
            <p className="text-neutral-300 text-sm truncate w-[120px]">
              {item.title.length > 14 ? `${item.title.slice(0, 14)}...` : item.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
