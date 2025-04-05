import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginImage from '../../assets/images/login.png';
import googleIcon from '../../assets/icons/google.png';
import appleIcon from '../../assets/icons/apple.png';
import facebookIcon from '../../assets/icons/facebook.png';
import { IoArrowBackCircleSharp } from 'react-icons/io5';
import { auth } from '../../server/config/FireBase';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  FacebookAuthProvider 
} from 'firebase/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    if (email && password) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Đăng nhập thành công");
        navigate('home');
      } catch (err) {
        console.log('Có lỗi:', err.message);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Đăng nhập Google thành công", result.user);
      navigate('home');
    } catch (error) {
      console.error("Lỗi đăng nhập Google:", error.message);
    }
  };

  const handleFacebookSignIn = async () => {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Đăng nhập Facebook thành công", result.user);
      navigate('home');
    } catch (error) {
      console.error("Lỗi đăng nhập Facebook:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-600">
      {/* Nút quay lại */}
      <div className="flex justify-start p-4">
        <IoArrowBackCircleSharp 
          size="50" 
          color="black"
          onClick={() => navigate('/')}
          className="p-2 bg-yellow-400 rounded-tr-2xl rounded-bl-2xl shadow-lg hover:bg-yellow-500 transition"
        />   
      </div>

      {/* Ảnh logo */}
      <div className="flex justify-center mb-6">
        <img
          src={loginImage}
          alt="Login"
          className="w-32 h-32 object-cover animate-fade-in"
        />
      </div>

      {/* Form đăng nhập */}
      <div className="flex-1 bg-white rounded-t-[50px] px-8 py-8 shadow-lg">
        <form className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full p-4 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Mật khẩu */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Mật Khẩu
            </label>
            <input
              type="password"
              className="w-full p-4 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Quên mật khẩu */}
          <div className="flex justify-end">
            <button
              type="button"
              className="text-gray-700 hover:text-yellow-500"
              onClick={() => alert('Chức năng đang phát triển!')}
            >
              Quên Mật Khẩu?
            </button>
          </div>

          {/* Nút Đăng Nhập */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-3 bg-yellow-400 text-gray-700 font-bold text-xl rounded-xl shadow-md hover:bg-yellow-500 transition"
          >
            Đăng Nhập
          </button>
        </form>

        {/* Hoặc */}
        <div className="text-center text-gray-700 font-bold my-6">Hoặc</div>

        {/* Đăng nhập với các mạng xã hội */}
        <div className="flex justify-center space-x-8">
          <button
            className="p-3 bg-gray-100 rounded-full shadow-md hover:bg-gray-200 transition"
            onClick={handleGoogleSignIn}
          >
            <img src={googleIcon} alt="Google" className="w-8 h-8" />
          </button>
          {/* Nếu có đăng nhập Apple, thêm xử lý tương tự */}
          <button
            className="p-3 bg-gray-100 rounded-full shadow-md hover:bg-gray-200 transition"
            onClick={() => alert('Chức năng Apple đang phát triển!')}
          >
            <img src={appleIcon} alt="Apple" className="w-8 h-8" />
          </button>
          <button
            className="p-3 bg-gray-100 rounded-full shadow-md hover:bg-gray-200 transition"
            onClick={handleFacebookSignIn}
          >
            <img src={facebookIcon} alt="Facebook" className="w-8 h-8" />
          </button>
        </div>

        {/* Đăng kí */}
        <div className="text-center mt-8">
          <span className="text-gray-500">Bạn Không Có Tài Khoản? </span>
          <button
            onClick={() => navigate('/signup')}
            className="text-yellow-500 font-medium hover:underline"
          >
            Đăng Kí
          </button>
        </div>
      </div>
    </div>
  );
}
