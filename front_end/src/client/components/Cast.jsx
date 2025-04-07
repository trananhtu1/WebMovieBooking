import React from 'react';
import { useNavigate } from 'react-router-dom';
import { fallbackPersonImage, image185 } from '../../server/api/MovieDB';
export default function Cast({ cast}) {
  const navigate = useNavigate();

  return (
    <div className="my-6 mb-6">
      <h2 className=" text-gray-900 dark:text-yellow-400 text-lg mx-4 mb-5">Diễn Viên</h2>
      <div className="flex overflow-x-auto px-4">
        {cast &&
          cast.map((person, index) => (
            <button
              key={index}
              onClick={() => navigate(`/person/${person.id}`)}
              className="flex flex-col items-center mr-4"
            >
              <div className="overflow-hidden rounded-full h-20 w-20 border border-neutral-500">
                <img
                  className="object-cover h-20 w-20 mb-5"
                  src={person?.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : fallbackPersonImage}
                  alt={person?.original_name || 'Diễn viên'}
                />
              </div>
              <p className="text-white text-xs mt-1">
                {person?.character?.length > 10 ? `${person.character.slice(0, 10)}...` : person?.character || ''}
              </p>
              <p className="text-neutral-400 text-xs">
                {person?.original_name?.length > 10 ? `${person.original_name.slice(0, 10)}...` : person?.original_name || ''}
              </p>
            </button>
          ))}
      </div>
    </div>
  );
}
