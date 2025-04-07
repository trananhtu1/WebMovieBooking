// components/ThemeSwitcher.js
import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';


const ThemeSwitcher = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setIsDarkMode(savedMode === 'true');
      document.documentElement.classList.toggle('dark', savedMode === 'true');
    }
  }, []);
  
  const toggleMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
    localStorage.setItem('darkMode', !isDarkMode);
  };
  

  return (
    <Button
      type="primary"
      icon={isDarkMode ? <MoonOutlined />:<SunOutlined />  }
      onClick={toggleMode}
      className="absolute top-4 right-4 bg-yellow-500 text-white p-2 rounded-full shadow-lg"
    />
  );
};

export default ThemeSwitcher;
