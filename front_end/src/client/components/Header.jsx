import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Profile } from '../components/Profile';

export default function Header() {
  const navigate = useNavigate();
  

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        
        <div className="flex space-x-4">
          <button onClick={() => navigate('/search')} className="text-gray-600 hover:text-blue-600">
            Tìm Kiếm
          </button>
        </div>
        <h1 className="text-2xl font-bold">
            <button onClick={()=> navigate('/home')}>
                <span className="text-blue-600">Betú</span> Cinemas
            </button>
        </h1>
        <Profile />
      </div>
    </header>
  );
}
