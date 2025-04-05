import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaRegHeart } from "react-icons/fa";
import { IoArrowBackCircleSharp } from 'react-icons/io5';
import Cast from '../components/Cast';
import MovieList from '../components/MovieList';
import {
  fallbackMoviePoster,
  fetchMovieCredits,
  fetchMovieDetails,
  fetchSimilarMovies,
  image500,
} from '../../server/api/MovieDB';
import Loading from '../components/Loading';
import Header from '../components/Header';

export default function MovieScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState({});
  const [cast, setCast] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [isFavourite, toggleFavourite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getMovieDetails(id);
    getMovieCredits(id);
    getSimilarMovies(id);
  }, [id]);

  const getMovieDetails = async (id) => {
    const data = await fetchMovieDetails(id);
    setLoading(false);
    if (data) {
      setMovie({ ...movie, ...data });
    }
  };

  const getMovieCredits = async (id) => {
    const data = await fetchMovieCredits(id);
    if (data && data.cast) {
      setCast(data.cast);
    }
  };

  const getSimilarMovies = async (id) => {
    const data = await fetchSimilarMovies(id);
    if (data && data.results) {
      setSimilarMovies(data.results);
    }
  };

  // Format duration to match Beta Cinemas style
  const formatDuration = (minutes) => {
    return `${minutes} phút`;
  };
  const handleBuyClick = () => {
    
    navigate(`/buy/${id}`);
  };
  return (
    <div className="bg-white min-h-screen pb-10">
      <Header/>
      {/* Breadcrumb */}
      <div className="mt-12 max-w-7xl mx-auto px-4 py-4">
        <div className="text-sm">
          <span className="text-gray-600">Trang chủ &gt; </span>
          <span className="text-blue-600">{movie?.title}</span>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Movie Poster */}
            <div className="w-full md:w-1/3 lg:w-1/4">
              <img
                src={image500(movie.poster_path) || fallbackMoviePoster}
                alt={movie.title}
                className="w-full rounded-lg shadow-lg"
                style={{
                  maxWidth: '360px',
                  aspectRatio: '2/3',
                  objectFit: 'cover'
                }}
              />
            </div>

            {/* Movie Details */}
            <div className="w-full md:w-2/3 lg:w-3/4">
              <h1 className="text-3xl font-bold mb-6">{movie?.title}</h1>
              
              <p className="text-gray-700 mb-8 leading-relaxed">
                {movie?.overview}
              </p>

              <div className="space-y-4">
                <DetailRow label="ĐẠO DIỄN:" value={movie?.director || 'N/A'} />
                <DetailRow 
                  label="DIỄN VIÊN:" 
                  value={cast.slice(0, 3).map(actor => actor.name).join(', ')} 
                />
                <DetailRow 
                  label="THỂ LOẠI:" 
                  value={movie?.genres?.map(genre => genre.name).join(', ')} 
                />
                <DetailRow 
                  label="THỜI LƯỢNG:" 
                  value={formatDuration(movie?.runtime)} 
                />
                <DetailRow label="NGÔN NGỮ:" value="Tiếng Việt" />
                <DetailRow 
                  label="NGÀY KHỞI CHIẾU:" 
                  value={movie?.release_date?.split('-').reverse().join('/')} 
                />
              </div>

              {/* Book Ticket Button */}
              <button className="mt-8 w-full py-3 bg-red-600 text-white text-lg font-semibold rounded-lg hover:bg-red-700 transition-colors duration-300"
              onClick={handleBuyClick}>
                Đặt Vé
              </button>
            </div>
          </div>

          {/* Cast Section */}
          {cast.length > 0 && <Cast cast={cast} />}

          {/* Similar Movies */}
          {similarMovies.length > 0 && (
            <MovieList title="Phim Liên Quan" hideSeeAll={true} data={similarMovies} />
          )}
        </div>
      )}
    </div>
  );
}

const DetailRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
    <span className="font-bold min-w-[140px]">{label}</span>
    <span className="text-gray-700">{value}</span>
  </div>
);