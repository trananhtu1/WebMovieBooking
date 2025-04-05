import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMovieDetails } from '../../server/api/MovieDB';
import { OptionsTicket } from '../components/OptionsTicket';
import Loading from '../components/Loading';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from "../../server/config/FireBase";
import Header from '../components/Header';

export function BuyTicketPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const getMovieData = async () => {
      try {
        const data = await fetchMovieDetails(id);
        if (data) {
          setMovieData(data);
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };
    getMovieData();
  }, [id]);

  // Hàm gọi API backend để khởi tạo thanh toán qua MoMo
  const handleSelectSeats = async (selectedDate, selectedTime, selectedSeats, totalPrice) => {
    if (!user) {
      alert("Bạn cần đăng nhập để đặt vé.");
      return;
    }
    try {
      setPaymentLoading(true);
      const userId = user.uid; // Sử dụng user.uid từ Firebase Auth
      const ticketInfo = {
        movieId: movieData.id,
        movieTitle: movieData.title,
        date: selectedDate,
        time: selectedTime,
        seatNumbers: selectedSeats,
      };

      const response = await fetch('http://localhost:5000/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalPrice, userId, ticketInfo })
      });

      const data = await response.json();
      if (data.payUrl) {
        window.location.href = data.payUrl; // Redirect tới trang thanh toán MoMo
      } else {
        console.error('Payment initiation failed');
        alert('Thanh toán không thành công. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Có lỗi xảy ra trong quá trình thanh toán.');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!movieData) return <div>Movie not found</div>;
  if (paymentLoading) return <Loading text="Đang xử lý đặt vé..." />;

  return (
    <div className="min-h-screen bg-white py-8">
      <Header/>
      {/* Breadcrumb */}
      <div className="mt-12 max-w-4xl mx-auto px-4 mb-6">
        <div className="text-sm">
          <span className="text-gray-600">Trang chủ &gt; </span>
          <span className="text-gray-600">{movieData.title} &gt; </span>
          <span className="text-blue-600">Đặt vé</span>
        </div>
      </div>

      {/* Login Notice */}
      {!user && (
        <div className="max-w-4xl mx-auto px-4 mb-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Bạn cần đăng nhập để đặt vé xem phim.{' '}
                  <button 
                    onClick={() => navigate('/login', { state: { redirectTo: `/buy-ticket/${id}` } })}
                    className="font-medium text-yellow-700 underline"
                  >
                    Đăng nhập ngay
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Truyền handleSelectSeats cho component OptionsTicket */}
      <OptionsTicket 
        movieData={movieData} 
        onSelectSeats={handleSelectSeats}
      />
    </div>
  );
}

export default BuyTicketPage;
