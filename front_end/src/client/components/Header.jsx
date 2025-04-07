import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Profile } from '../components/Profile';
import ThemeSwitcher from '../components/ThemeSwitcher';

export default function Header() {
  const navigate = useNavigate();
  

  return (
    <header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        
        <div className="flex space-x-4">
          <button onClick={() => navigate('/search')} className="text-gray-700 dark:text-white hover:text-yellow-600">
            Tìm Kiếm
          </button>
        </div>
        <h1 className="text-2xl font-bold">
            <button onClick={()=> navigate('/home')}>
                <span className="text-yellow-300">Betú Cinemas </span>
            </button>
        </h1>
        <ThemeSwitcher />
        <Profile />
      </div>
    </header>
  );
}
