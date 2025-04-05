import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../../server/config/FireBase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

// Tạo Context
export const AuthContext = createContext();

// Tạo Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user || null);
    });
    
    return unsub;
  }, []);

  const logout = async (navigate) => {
  try {
    await signOut(auth);
    setUser(null);
    console.log("Dang xuat thanh cong");
    navigate("/welcome"); // Điều hướng về trang chào mừng
  } catch (error) {
    console.error("Loi dang xuat:", error.message);
  }
};
  
  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook để sử dụng AuthContext
export const UseAuth = () => useContext(AuthContext);