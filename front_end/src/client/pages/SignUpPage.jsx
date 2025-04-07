import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import signupImage from '../../assets/images/signup.png';
import googleIcon from '../../assets/icons/google.png';
import appleIcon from '../../assets/icons/apple.png';
import facebookIcon from '../../assets/icons/facebook.png';
import { IoArrowBackCircleSharp } from 'react-icons/io5';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../server/config/FireBase';
import { doc, setDoc } from 'firebase/firestore';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSubmit = async () => {
    if (email && password && fullName) {
      try {
        // Tạo người dùng với email và mật khẩu
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Lưu thông tin bổ sung vào collection 'userProfiles' với ID là UID của người dùng
        const userDocRef = doc(db, 'userProfiles', user.uid);
        await setDoc(userDocRef, {
          name: fullName,
          email: email,
          // Bạn có thể thêm các thông tin khác tại đây nếu cần
        });

        console.log('Đăng ký thành công:', { user });
        navigate('/welcome');
      } catch (err) {
        console.error('Có lỗi:', err.message);
        // Xử lý lỗi đăng ký (ví dụ: hiển thị thông báo cho người dùng)
      }
    } else {
      console.warn('Vui lòng nhập đầy đủ họ và tên, email và mật khẩu.');
      // Hiển thị cảnh báo cho người dùng nếu thiếu thông tin
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-600">
      {/* Nút quay lại */}
      <div className="flex justify-start p-4">
        <IoArrowBackCircleSharp
          size="50" color="black"
          onClick={() => navigate(-1)}
          className="p-2 bg-yellow-400 rounded-tr-2xl rounded-bl-2xl shadow-lg hover:bg-yellow-500 transition"
        >
        </IoArrowBackCircleSharp>
      </div>

      {/* Ảnh logo */}
      <div className="flex justify-center mb-6">
        <img
          src={signupImage}
          alt="Sign Up"
          className="w-32 h-28 object-cover animate-fade-in"
        />
      </div>

      {/* Form đăng ký */}
      <div className="flex-1 bg-white rounded-t-[50px] px-8 py-8 shadow-lg">
        <form className="space-y-6">
          {/* Họ và Tên */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Họ Và Tên
            </label>
            <input
              type="text"
              className="w-full p-4 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Nhập họ và tên"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
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

          {/* Nút Đăng Ký */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-3 bg-yellow-400 text-gray-700 font-bold text-xl rounded-xl shadow-md hover:bg-yellow-500 transition"
          >
            Đăng Ký
          </button>
        </form>

        {/* Hoặc */}
        <div className="text-center text-gray-700 font-bold my-6">Hoặc</div>

        {/* Đăng ký với các mạng xã hội */}
        <div className="flex justify-center space-x-8">
          <button className="p-3 bg-gray-100 rounded-full shadow-md hover:bg-gray-200 transition">
            <img src={googleIcon} alt="Google" className="w-8 h-8" />
          </button>
          <button className="p-3 bg-gray-100 rounded-full shadow-md hover:bg-gray-200 transition">
            <img src={appleIcon} alt="Apple" className="w-8 h-8" />
          </button>
          <button className="p-3 bg-gray-100 rounded-full shadow-md hover:bg-gray-200 transition">
            <img src={facebookIcon} alt="Facebook" className="w-8 h-8" />
          </button>
        </div>

        {/* Đăng nhập */}
        <div className="text-center mt-8">
          <span className="text-gray-500">Bạn Đã Có Tài Khoản? </span>
          <button
            onClick={() => navigate('/login')}
            className="text-yellow-500 font-medium hover:underline"
          >
            Đăng Nhập
          </button>
        </div>
      </div>
    </div>
  );
}