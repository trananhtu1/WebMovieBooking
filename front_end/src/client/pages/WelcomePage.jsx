import React from 'react';
import { useNavigate } from 'react-router-dom';
import welcomeImage from '../../assets/images/welcome.png';
import welcomePic from '../../assets/images/banner-wellcome.jpg';
export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-between items-center h-screen bg-gradient-to-b from-neutral-700 via-neutral-800 to-neutral-900 text-white"
    style={{
        backgroundImage: `url(${welcomePic})`,
        backgroundSize: 'cover', // Ảnh phủ toàn bộ
        backgroundRepeat: 'no-repeat', // Không lặp lại
        backgroundPosition: 'center', // Căn giữa ảnh
      }}
    >
      {/* Tiêu đề */}
      
      <h1 className="text-5xl font-extrabold text-center mt-10 tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-yellow-500 animate-pulse">
        BeTu CenterPoint!
      </h1>

      {/* Ảnh chào mừng */}
      <div className="flex justify-center">
        <img 
          src={welcomeImage} 
          alt="Welcome" 
          className="w-full h-64 object-cover rounded-lg  animate-fade-in"
        />
      </div>

      {/* Các nút */}
      <div className="pace-y-4 flex flex-col items-center">
        {/* Nút Đăng Nhập */}
        <button
          onClick={() => navigate('/login')}
          className="py-3 bg-yellow-400 text-gray-700 text-xl font-bold rounded-xl w-3/4 shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl"
        >
          Đăng Nhập
        </button>

        {/* Dòng chữ Đăng Kí */}
        <div className="flex justify-center items-center space-x-2">
          <span className="text-lg font-medium text-gray-700">
            Bạn Chưa Có Tài Khoản?
          </span>
          <button
            onClick={() => navigate('/signup')}
            className="text-lg font-semibold text-gray-700 underline hover:text-yellow-300"
          >
            Đăng Kí
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-sm font-light mb-4">
        © 2025 XemPhimNào. Tất cả các quyền được bảo lưu.
      </footer>
    </div>
  );
}
