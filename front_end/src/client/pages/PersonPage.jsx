import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  fetchPersonDetails, 
  fetchPersonMovies,
  image500 
} from '../../server/api/MovieDB';
import Loading from '../components/Loading';
import MovieList from '../components/MovieList';
import Header from '../components/Header';

const PersonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavourite, setIsFavourite] = useState(false);
  const [person, setPerson] = useState({});
  const [personMovies, setPersonMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersonData = async () => {
      try {
        setLoading(true);
        const personDetails = await fetchPersonDetails(id);
        const movieData = await fetchPersonMovies(id);
        
        if (personDetails) setPerson(personDetails);
        if (movieData && movieData.cast) setPersonMovies(movieData.cast);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching person details:', error);
        setLoading(false);
      }
    };

    fetchPersonData();
  }, [id]);
  console.log(person);
  const formatGender = (gender) => {
    switch (gender) {
      case 1: return 'Nữ';
      case 2: return 'Nam';
      default: return 'Không xác định';
    }
  };
 
  return (
    <div className="bg-white min-h-screen pb-10">
      <Header/>

      {/* Main Content */}
      <div className="mt-12 max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <Loading />
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Person Image */}
            <div className="md:col-span-1 flex justify-center">
              <div className="relative">
                <img
                  src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                  alt={person.name}
                  className="w-full max-w-[400px] rounded-lg shadow-lg object-cover"
                  onError={(e) => {
                    e.target.src = '/path/to/fallback-image.jpg';
                  }}
                />
                <button 
                  onClick={() => setIsFavourite(!isFavourite)}
                  className={`absolute top-4 right-4 p-2 rounded-full ${
                    isFavourite 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white/50 text-gray-700'
                  }`}
                >
                  ♥
                </button>
              </div>
            </div>

            {/* Person Details */}
            <div className="md:col-span-2 space-y-6">
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-blue-600 mb-2">
                  {person.name}
                </h1>
                <p className="text-gray-600">
                  {person.place_of_birth || 'Địa điểm chưa xác định'}
                </p>
              </div>

              {/* Detailed Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-100 p-6 rounded-lg">
                <DetailItem 
                  label="Giới Tính" 
                  value={formatGender(person.gender)} 
                />
                <DetailItem 
                  label="Ngày Sinh" 
                  value={person.birthday || 'N/A'} 
                />
                <DetailItem 
                  label="Nghề Nghiệp" 
                  value={person.known_for_department || 'N/A'} 
                />
                <DetailItem 
                  label="Độ Phổ Biến" 
                  value={`${person.popularity?.toFixed(2) || 0}%`} 
                />
              </div>

              {/* Biography */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Tiểu Sử</h2>
                <p className="text-gray-700 leading-relaxed">
                  {person.biography || 'Không có thông tin chi tiết.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Movies Participated */}
        {!loading && personMovies.length > 0 && (
          <MovieList 
            title="Phim Đã Tham Gia" 
            data={personMovies} 
            hideSeeAll={true} 
          />
        )}
      </div>
    </div>
  );
};

// Helper component for detail items
const DetailItem = ({ label, value }) => (
  <div className="text-center">
    <p className="font-semibold text-gray-700">{label}</p>
    <p className="text-blue-600">{value}</p>
  </div>
);

export default PersonPage;