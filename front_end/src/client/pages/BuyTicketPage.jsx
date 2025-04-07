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
  const handleSelectSeats = async (selectedRoom, selectedDate, selectedTime, selectedSeats, totalPrice) => {
    if (!user) {
      alert("Bạn cần đăng nhập để đặt vé.");
      return;
    }

    try {
      setPaymentLoading(true);
      const userId = user.uid;

      // Tạo showtimeId để liên kết
      const showtimeId = `${movieData.id}-${selectedRoom}-${selectedDate}-${selectedTime}`;

      const ticketInfo = {
        movieId: movieData.id,
        movieTitle: movieData.title,
        showtimeId, // Liên kết với showtime
        date: selectedDate,
        time: selectedTime,
        seatNumbers: selectedSeats,
        roomId: selectedRoom, // Chắc chắn gửi đúng roomId
      };

      // Gửi yêu cầu thanh toán qua API backend
      const response = await fetch('http://localhost:5000/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalPrice, userId, ticketInfo }) // Gửi đủ
      });

      const data = await response.json();
      console.log('Response from backend:', data);  // Log phản hồi từ server

      if (data.payUrl) {
        window.location.href = data.payUrl; // Điều hướng người dùng đến trang thanh toán
      } else {
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
    <div className="min-h-screen bg-lightBg text-lightText dark:bg-darkBg dark:text-darkText transition-colors duration-300">
      <Header />
      {/* Breadcrumb */}
      <div className="mt-16 max-w-4xl mx-auto px-4 mb-6">
        <div className="text-md">
          <span className=" text-gray-900 dark:text-yellow-400">Trang chủ &gt; </span>
          <span className="  text-yellow-400">{movieData.title} &gt; </span>
          <span className=" text-gray-900 dark:text-yellow-400">Đặt vé</span>
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
