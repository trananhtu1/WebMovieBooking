import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import Loading from '../components/Loading';
import { searchMovies } from '../../server/api/MovieDB';
import movieTime from '../../assets/images/movieTime.png';
import Header from '../components/Header';
const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="relative group cursor-pointer max-w-sm"
      onClick={() => navigate(`/movie/${movie.id}`)}
    >
      {/* Movie Poster */}
      <div className="rounded-lg overflow-hidden shadow-lg">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Movie Info */}
      <div className="mt-4 space-y-2">
        <h3 className="text-lg font-semibold text-blue-600 hover:text-blue-800">
          {movie.title.length > 22 ? `${movie.title.slice(0, 22)}...` : movie.title}
        </h3>
        <div className="text-gray-600">
          <p><span className="font-medium">Thể loại:</span> {movie.genre_ids?.map(id => "Kinh dị").join(', ')}</p>
          <p><span className="font-medium">Thời lượng:</span> 120 phút</p>
        </div>
      </div>
    </div>
  );
};

export default function SearchPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async (search) => {
    if (search && search.length > 2) {
      setLoading(true);
      try {
        const data = await searchMovies({
          query: search,
          include_adult: false,
          language: 'vi',
          page: '1'
        });
        
        setLoading(false);
        if (data && data.results) setResults(data.results);
      } catch (error) {
        console.error('Search error:', error);
        setLoading(false);
      }
    } else {
      setLoading(false);
      setResults([]);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((search) => handleSearch(search), 400),
    []
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header/>

      {/* Search Input */}
      <div className="mt-12 max-w-7xl mx-auto px-4 py-6">
        <div className="relative">
          <input 
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Tìm kiếm phim..."
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Search Results */}
      <main className="max-w-7xl mx-auto px-4">
        {loading ? (
          <Loading />
        ) : results.length > 0 ? (
          <div>
            <h2 className="text-xl font-semibold mb-6">
              Kết Quả Tìm Kiếm ({results.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {results.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <img 
              src={movieTime} 
              alt="No results" 
              className="h-96 w-96"
            />
          </div>
        )}
      </main>
    </div>
  );
}