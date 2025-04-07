import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { fetchTopRatedMovies, fetchTrendingMovies, fetchUpcomingMovies } from '../../server/api/MovieDB';
import Header from '../components/Header';
import bannerImage1 from '../../assets/images/30-4.jpg';
import bannerImage2 from '../../assets/images/hs-ts.png';
import bannerImage3 from '../../assets/images/top-banner.jpg';
import myFixedPoster from '../../assets/images/poster.jpg';
import { Carousel } from 'antd';


const MovieCard = ({ movie, onBooking }) => {
  const navigate = useNavigate();
  
  const handleMovieClick = () => {
    navigate(`/movie/${movie.id}`);
  };
  return(
  <div className="relative group cursor-pointer max-w-sm"
  onClick={handleMovieClick}>
    <div className="absolute top-2 left-2 bg-yellow-400 text-black px-2 py-1 rounded z-10">
      {movie.adult ? 'T18' : 'T16'}
    </div>

    <div className="absolute top-0 right-0 bg-red-500 text-white px-4 py-1 rotate-45 translate-x-8 -translate-y-2">
      HOT
    </div>

    <div className="rounded-lg overflow-hidden shadow-lg">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>

    <div className="mt-4 space-y-2">
      <h3 className="text-lg font-semibold text-yellow-500 hover:text-yellow-700 truncate max-w-full cursor-pointer"
      onClick={handleMovieClick} title={movie.title}>
        {movie.title}
      </h3>
      <div className="text-gray-700 dark:text-white">
        <p><span className="font-medium">Điểm IMDB :</span>{movie.vote_average.toFixed(2)} </p>
      </div>
      {onBooking && (
        <button 
          onClick={() => onBooking(movie)}
          className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors mt-2"
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
    <h2 className="text-2xl font-bold mb-6 text-yellow-400">{title}</h2>
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
  const carouselRef = useRef(null); 

  useEffect(() => {
    getTrendingMovies();
    getUpcomingMovies();
    getTopRatedMovies();
    setFixedPosterSrc(myFixedPoster);
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
      ? 'border-yellow-300 text-yellow-500 dark:text-white' 
      : 'border-transparent text-gray-700 dark:text-white hover:text-yellow-600'}`;

  const bannerImages = [
    { src: bannerImage1, alt: 'Banner 1' },
    { src: bannerImage2, alt: 'Banner 2' },
    { src: bannerImage3, alt: 'Banner 3' },
  ];
  const [fixedPosterSrc, setFixedPosterSrc] = useState(null);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

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

      {loading ? (
        <Loading />
      ) : (
        <main className="max-w-7xl mx-auto px-4">
          <div className="max-w-7xl mx-auto px-4 py-8 flex items-center">
            <div className="w-full md:w-3/4 lg:w-5/6 mr-4">
              <Carousel autoplay effect="scrollx" ref={carouselRef}>
                {bannerImages.map((banner, index) => (
                  <div key={index}>
                    <img
                      src={banner.src}
                      alt={banner.alt}
                      className="w-full rounded-lg shadow-md object-cover h-48 md:h-64 lg:h-80"
                    />
                  </div>
                ))}
              </Carousel>
            </div>
            {fixedPosterSrc && (
              <div className="w-1/4 md:w-1/4 lg:w-1/6 rounded-lg overflow-hidden">
                <img
                  src={fixedPosterSrc}
                  alt="Fixed Poster"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {!fixedPosterSrc && (
              <div className="w-1/4 md:w-1/4 lg:w-1/6 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center h-48 md:h-64 lg:h-80">
                <span>Poster</span>
              </div>
            )}
          </div>
          
          {activeTab === 'trending' && (
            <MovieSection title="Trending Movies" movies={trending} showBooking={false} />
          )}
          {activeTab === 'upcoming' && (
            <MovieSection title="Upcoming Movies" movies={upcoming} showBooking={true} />
          )}
          {activeTab === 'toprated' && (
            <MovieSection title="Top Rated Movies" movies={topRated} showBooking={true} />
          )}
        </main>
      )}
    </div>
  );
}
