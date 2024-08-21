import React, { useState, useEffect } from 'react';
import { useAuth } from "../providers/auth";
import AvatarModal from '../components/AvatarModal';
import { API_URL } from "../config/settings";

export const MyPage = () => {
  const { currentUser, setCurrentUser, token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [avatars, setAvatars] = useState([]);

  useEffect(() => {
    if (currentUser !== undefined) {
      setIsLoading(false);
      fetchAvatars();
    }
  }, [currentUser]);

  const fetchAvatars = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/avatars`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch avatars');
      }

      const data = await response.json();
      setAvatars(data);
    } catch (error) {
      console.error('Error fetching avatars:', error);
    }
  };

  const handleAvatarClick = () => {
    setIsModalOpen(true);
  };

  const handleAvatarSelect = async (avatarId) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/users/update_avatar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ avatar_id: avatarId })
      });

      if (!response.ok) {
        throw new Error('Failed to update avatar');
      }

      const data = await response.json();
      setCurrentUser(prevUser => ({
        ...prevUser,
        avatar: data.avatar
      }));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  if (!currentUser) {
    return <div className="text-center">Please log in to access this page.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="card lg:card-side bg-base-100 shadow-xl">
        <figure onClick={handleAvatarClick} className="cursor-pointer">
          <img 
            src={currentUser.avatar.avatar_url} 
            alt="Avatar" 
            className="w-64 h-64 rounded-full object-cover"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title text-3xl">{currentUser.nickname}</h2>
          <div className="badge badge-primary">ID: {currentUser.id}</div>
          <a 
            href={`https://github.com/${currentUser.nickname}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-primary mt-4"
          >
            GitHub Profile
          </a>
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-2">Repositories</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {currentUser.github_repositories.map((repo, index) => (
                <a 
                  key={index} 
                  href={`https://github.com/${currentUser.nickname}/${repo}`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-outline btn-sm"
                >
                  {repo}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <AvatarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        avatars={avatars}
        onSelect={handleAvatarSelect}
      />
    </div>
  );
};

export default MyPage;