import React from 'react';
import { format } from 'date-fns';

export const InventoryTicket = ({ ticket }) => {
  // Xác định trạng thái thanh toán và lớp CSS tương ứng
  let statusClass = '';
  let statusText = '';
  
  if (ticket.paymentStatus === 'pending') {
    statusClass = "bg-yellow-100 text-yellow-800";
    statusText = "Đang xử lý";
  } else if (ticket.isPaid) {
    statusClass = "bg-green-100 text-green-800";
    statusText = "Đã thanh toán";
  } else {
    statusClass = "bg-red-100 text-red-800";
    statusText = "Chưa thanh toán";
  }
  
  // Format các ngày tháng
  const formattedCreatedDate = ticket.createdAt 
    ? format(new Date(ticket.createdAt), 'dd/MM/yyyy HH:mm')
    : 'N/A';
    
  const formattedPaidDate = ticket.paidAt
    ? format(new Date(ticket.paidAt), 'dd/MM/yyyy HH:mm')
    : 'N/A';
    
  const formattedShowDate = ticket.showDate 
    ? format(new Date(ticket.showDate), 'dd/MM/yyyy')
    : 'N/A';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{ticket.movieTitle}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
          {statusText}
        </span>
      </div>
      
      {/* Movie poster (if available) */}
      {ticket.moviePoster && (
        <div className="w-full h-40 bg-gray-200 relative overflow-hidden">
          <img 
            src={`https://image.tmdb.org/t/p/w500${ticket.moviePoster}`}
            alt={ticket.movieTitle}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* Ticket details */}
      <div className="p-4">
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Ngày chiếu:</span>
            <span className="font-medium">{formattedShowDate}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Giờ chiếu:</span>
            <span className="font-medium">{ticket.showTime || 'N/A'}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Rạp:</span>
            <span className="font-medium">{ticket.theater || 'N/A'}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Số ghế:</span>
            <span className="font-medium">{ticket.quantity}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Vị trí:</span>
            <span className="font-medium">{ticket.seats || 'N/A'}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Tổng tiền:</span>
            <span className="font-medium text-green-600">{ticket.amount?.toLocaleString()} VND</span>
          </div>
          
          {ticket.isPaid && (
            <>
              <div className="flex justify-between">
                <span>Thanh toán lúc:</span>
                <span className="font-medium">{formattedPaidDate}</span>
              </div>
              
              {ticket.transactionId && (
                <div className="flex justify-between">
                  <span>Mã giao dịch:</span>
                  <span className="font-medium">{ticket.transactionId}</span>
                </div>
              )}
            </>
          )}
          
          {!ticket.isPaid && ticket.paymentFailReason && (
            <div className="flex justify-between">
              <span>Lý do thất bại:</span>
              <span className="font-medium text-red-600">{ticket.paymentFailReason}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
        <div>Mã vé: {ticket.id}</div>
        <div>Tạo lúc: {formattedCreatedDate}</div>
      </div>
      
      {/* Action buttons */}
      {!ticket.isPaid && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <button 
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
            onClick={() => window.location.href = `/payment-retry/${ticket.id}`}
          >
            Thanh toán lại
          </button>
        </div>
      )}
    </div>
  );
};

export default InventoryTicket;