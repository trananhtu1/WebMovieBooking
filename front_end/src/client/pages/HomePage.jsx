import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { fetchTopRatedMovies, fetchTrendingMovies, fetchUpcomingMovies } from '../../server/api/MovieDB';
import Header from '../components/Header';



const MovieCard = ({ movie, onBooking }) => {
  const navigate = useNavigate();
  
  const handleMovieClick = () => {
    // Navigate to the movie details page with the specific movie ID
    navigate(`/movie/${movie.id}`);
  };
  return(
  <div className="relative group cursor-pointer max-w-sm"
  onClick={handleMovieClick}>
    {/* Age Rating Badge */}
    <div className="absolute top-2 left-2 bg-yellow-400 text-black px-2 py-1 rounded z-10">
      {movie.adult ? 'T18' : 'T16'}
    </div>
    
    {/* Hot Badge */}
    <div className="absolute top-0 right-0 bg-red-500 text-white px-4 py-1 rotate-45 translate-x-8 -translate-y-2">
      HOT
    </div>

    {/* Movie Poster */}
    <div className="rounded-lg overflow-hidden shadow-lg"
    onClick={handleMovieClick}>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>

    {/* Movie Info */}
    <div className="mt-4 space-y-2">
      <h3 className="text-lg font-semibold text-blue-600 hover:text-blue-800 truncate max-w-full cursor-pointer"
      onClick={handleMovieClick} title={movie.title}>
        {movie.title}
      </h3>
      <div className="text-gray-600">
        <p><span className="font-medium">Điểm IMDB :</span>{movie.vote_average.toFixed(2)} </p>
      </div>
      {onBooking && (
        <button 
          onClick={() => onBooking(movie)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors mt-2"
        >
          MUA VÉ
        </button>
      )}
    </div>
  </div>
  );
};
const MovieSection = ({ title, movies, showBooking }) => (
  <section className="py-8">
    <h2 className="text-2xl font-bold mb-6">{title}</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {movies.map(movie => (
        <MovieCard 
          key={movie.id} 
          movie={movie} 
          onBooking={showBooking ? (movie) => console.log('Booking:', movie.title) : null}
        />
      ))}
    </div>
  </section>
);

export default function HomePage() {
  const [trending, setTrending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  
  useEffect(() => {
    getTrendingMovies();
    getUpcomingMovies();
    getTopRatedMovies();
  }, []);

  const getTrendingMovies = async () => {
    const data = await fetchTrendingMovies();
    if (data && data.results) setTrending(data.results);
    setLoading(false);
  };

  const getUpcomingMovies = async () => {
    const data = await fetchUpcomingMovies();
    if (data && data.results) setUpcoming(data.results);
  };

  const getTopRatedMovies = async () => {
    const data = await fetchTopRatedMovies();
    if (data && data.results) setTopRated(data.results);
  };

  const tabClass = (tab) => 
    `px-6 py-3 text-lg font-semibold cursor-pointer border-b-2 transition-colors
    ${activeTab === tab 
      ? 'border-blue-600 text-blue-600' 
      : 'border-transparent text-gray-600 hover:text-blue-600'}`;

  return (
    <div className="min-h-screen bg-white">
      <Header/>

      {/* Movie Categories Tabs */}
      <div className="mt-12 max-w-7xl mx-auto px-4 pt-6">
        <div className="flex border-b">
          <button 
            className={tabClass('trending')} 
            onClick={() => setActiveTab('trending')}
          >
            PHIM SẮP CHIẾU
          </button>
          <button 
            className={tabClass('upcoming')} 
            onClick={() => setActiveTab('upcoming')}
          >
            PHIM ĐANG CHIẾU
          </button>
          <button 
            className={tabClass('toprated')} 
            onClick={() => setActiveTab('toprated')}
          >
            SUẤT CHIẾU ĐẶC BIỆT
          </button>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <Loading />
      ) : (
        <main className="max-w-7xl mx-auto px-4">
          {activeTab === 'trending' && (
            <MovieSection title="" movies={trending} showBooking={false} />
          )}
          {activeTab === 'upcoming' && (
            <MovieSection title="" movies={upcoming} showBooking={true} />
          )}
          {activeTab === 'toprated' && (
            <MovieSection title="" movies={topRated} showBooking={true} />
          )}
        </main>
      )}
    </div>
  );
}