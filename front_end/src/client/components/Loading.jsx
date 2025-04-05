import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="relative w-40 h-40 border-8 border-t-yellow-400 border-yellow-600 rounded-full animate-spin"></div>
    </div>
  );
}
