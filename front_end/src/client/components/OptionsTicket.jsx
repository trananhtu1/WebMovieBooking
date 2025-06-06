import React, { useState } from 'react';

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

export function OptionsTicket({ movieData, onSelectSeats }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('roomA');  // Thêm state cho phòng chiếu
  const [showSeatDialog, setShowSeatDialog] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);

  const showtimes = ['10:00', '12:30', '15:00', '17:30', '20:00', '22:30'];
  const seatLayout = { rows: ['A', 'B', 'C', 'D', 'E', 'F'], seatsPerRow: 8, price: 90000 };

  const handleDateSelect = (date) => setSelectedDate(date);
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setShowSeatDialog(true);
  };

  const handleRoomSelect = (room) => setSelectedRoom(room); // Cập nhật phòng chiếu

  const handleSeatSelect = (seat) => {
    setSelectedSeats(selectedSeats.includes(seat)
      ? selectedSeats.filter(s => s !== seat)
      : [...selectedSeats, seat]
    );
    console.log({ selectedDate, selectedTime, selectedSeats, totalPrice, selectedRoom });
  };

  // Hàm xác nhận đặt vé
  const handlePurchase = async () => {
    // Kiểm tra nếu có thiếu dữ liệu
    if (!selectedDate || !selectedTime || selectedSeats.length === 0 || !selectedRoom) {
        alert('Vui lòng chọn đầy đủ thông tin.');
        return;
    }

    setLoading(true);
    try {
        // Tính tổng tiền cho vé
        const totalPrice = selectedSeats.length * seatLayout.price;
        
        // Gửi thông tin đặt vé bao gồm phòng chiếu, ngày, giờ và ghế đã chọn
        await onSelectSeats(selectedRoom, selectedDate, selectedTime, selectedSeats, totalPrice); // Thêm selectedRoom vào đây

        alert('Đặt vé thành công!');
    } catch (error) {
        console.error('Lỗi khi xử lý thanh toán:', error);
        alert('Đã xảy ra lỗi trong quá trình đặt vé.');
    }
    setLoading(false);
};



  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-yellow-400">{movieData.title}</h2>
        <div className="space-y-6">
          <div>
            <h3 className="flex items-center text-lg font-semibold mb-3  text-gray-900 dark:text-yellow-400">
              <CalendarIcon className="mr-2" /> Chọn Ngày
            </h3>
            <div className="grid grid-cols-7 gap-2  text-gray-900 dark:text-yellow-400">
              {[...Array(7)].map((_, index) => {
                const date = new Date();
                date.setDate(date.getDate() + index);
                const dateString = date.toISOString().split('T')[0];
                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => handleDateSelect(dateString)}
                    className={`p-3 rounded-lg text-center transition-colors ${selectedDate === dateString ? 'bg-yellow-400 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    <div className="text-sm">{date.toLocaleDateString('vi-VN', { weekday: 'short' })}</div>
                    <div className="font-bold">{date.getDate()}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedDate && (
            <div>
              <h3 className="flex items-center text-lg font-semibold mb-3  text-gray-900 dark:text-yellow-400">
                <ClockIcon className="mr-2" /> Chọn Giờ
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2  text-gray-900 dark:text-yellow-400">
                {showtimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => handleTimeSelect(time)}
                    className={`p-2 rounded-lg text-center transition-colors ${selectedTime === time ? 'bg-yellow-400 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >{time}</button>
                ))}
              </div>
            </div>
          )}

          {/* Chọn phòng chiếu */}
          <div>
            <h3 className="flex items-center text-lg font-semibold mb-3  text-gray-900 dark:text-yellow-400">
              Chọn Phòng Chiếu
            </h3>
            <div className="space-x-4">
              {['roomA', 'roomB', 'roomC'].map((room) => (
                <button
                  key={room}
                  onClick={() => handleRoomSelect(room)}
                  className={`p-2 rounded-lg transition-colors ${selectedRoom === room ? 'bg-yellow-400 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  {room.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showSeatDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6  text-gray-900 dark:text-yellow-400">
            <h2 className="text-xl font-bold">Chọn Ghế</h2>
            <div className="grid gap-4 mb-6">
              {seatLayout.rows.map((row) => (
                <div key={row} className="flex justify-center gap-2">
                  {[...Array(seatLayout.seatsPerRow)].map((_, seatIndex) => {
                    const seatNumber = `${row}${seatIndex + 1}`;
                    return (
                      <button
                        key={seatNumber}
                        onClick={() => handleSeatSelect(seatNumber)}
                        className={`w-8 h-8 rounded-lg ${selectedSeats.includes(seatNumber) ? 'bg-yellow-400 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                      >{seatIndex + 1}</button>
                    );
                  })}
                </div>
              ))}
            </div>
            <button onClick={handlePurchase} disabled={loading} className="w-full bg-yellow-400 text-white py-3 rounded-lg font-semibold disabled:bg-gray-300">
              {loading ? 'Đang xử lý...' : 'Xác nhận'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OptionsTicket;
