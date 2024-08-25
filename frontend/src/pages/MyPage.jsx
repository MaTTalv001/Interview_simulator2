import React, { useState, useEffect } from 'react';
import { useAuth } from "../providers/auth";
import AvatarModal from '../components/AvatarModal';
import { Link } from 'react-router-dom';
import { API_URL } from "../config/settings";
import { IconContext } from 'react-icons'
import { FaGithub } from "react-icons/fa";

export const MyPage = () => {
  const { currentUser, setCurrentUser, token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [avatars, setAvatars] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [isRepoListOpen, setIsRepoListOpen] = useState(false);


  useEffect(() => {
    if (currentUser !== undefined) {
      setIsLoading(false);
      fetchAvatars();
      fetchExperiences();
      console.log(currentUser);
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
        throw new Error('アバター情報の取得に失敗しました');
      }

      const data = await response.json();
      setAvatars(data);
    } catch (error) {
      console.error('アバター情報の取得に失敗しました', error);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);
  
  const fetchExperiences = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/experiences`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error('アバター情報の取得に失敗しました');
      }
  
      const data = await response.json();
      setExperiences(data);
    } catch (error) {
      console.error('アバター情報の取得に失敗しました', error);
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
        throw new Error('アバター情報の更新に失敗しました');
      }

      const data = await response.json();
      setCurrentUser(prevUser => ({
        ...prevUser,
        avatar: data.avatar
      }));
      setIsModalOpen(false);
    } catch (error) {
      console.error('アバター情報の更新に失敗しました', error);
    }
  };

  const handleExperienceChange = async (event) => {
    const experienceId = event.target.value;
    try {
      const response = await fetch(`${API_URL}/api/v1/users/update_experience`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ experience_id: experienceId })
      });
  
      if (!response.ok) {
        throw new Error('経験情報の取得に失敗しました');
      }
  
      const updatedUser = await response.json();
      setCurrentUser(prevUser => ({
        ...prevUser,
        experience: updatedUser.experience
      }));
    } catch (error) {
      console.error('経験情報の更新に失敗しました', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  const toggleRepoList = () => {
    setIsRepoListOpen(!isRepoListOpen);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  if (!currentUser) {
    return (
    <>
    <div className="text-center">
          <span className="mt-4 loading loading-spinner loading-lg"></span>
          <p className="mt-4">Now Loading...</p>
        </div>
    </>);
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="card lg:card-side bg-base-100 shadow-xl">
        <figure onClick={handleAvatarClick} className="cursor-pointer">
          <img 
            src={currentUser.avatar.avatar_url} 
            alt="Avatar" 
            className="w-64 h-64 rounded-full object-cover"
          />
        </figure>
        <div className="card-body">
        <div className="flex items-center">
    <h2 className="card-title text-3xl mr-4">{currentUser.nickname}</h2>
    <a 
      href={`https://github.com/${currentUser.nickname}`} 
      target="_blank" 
      rel="noopener noreferrer"
    >
      <IconContext.Provider value={{size: '30px'}}>
        <FaGithub />
      </IconContext.Provider>
    </a>
  </div>
          
          {/* <div className="badge badge-primary">ID: {currentUser.id}</div> */}
          <div className="mt-4">
  <label htmlFor="experience" className="block text-sm font-medium">
    経験レベル
  </label>
  <select
    id="experience"
    value={currentUser.experience?.id || ''}
    onChange={handleExperienceChange}
    className="mt-1 block w-full pl-3 pr-10 py-2 select select-bordered rounded-md bg-base-100 text-base-content"
  >
    {experiences && experiences.length > 0 ? (
      experiences.map((exp) => (
        <option key={exp.id} value={exp.id} className="bg-base-100 text-base-content">
          {exp.experience}
        </option>
      ))
) : (
  <option value="">Loading experiences...</option>
)}
            </select>
          </div>
          
          <div className="mt-8 flex justify-center space-x-4">
        <Link to="/Interview" className="btn btn-lg btn-primary">
          面接練習
        </Link>
        <Link to="/Logs" className="btn btn-lg btn-primary">
          練習ログ
        </Link>
        <Link to="/Logs" className="btn btn-lg btn-primary">
          情報交換
        </Link>
      </div>
      <div className="mt-6 text-center">
  <button 
    onClick={toggleRepoList} 
    className="btn btn-outline btn-secondary mx-auto block" 
  >
    {isRepoListOpen ? 'リポジトリを隠す' : 'リポジトリを表示'}
  </button>
  {isRepoListOpen && (
    <div className="mt-2 text-left">
      <h3 className="text-xl font-bold mb-2">Repositories</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2"> 
        {currentUser.github_repositories.map((repo, index) => (
          <a 
            key={index} 
            href={`https://github.com/${currentUser.nickname}/${repo}`}
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-outline btn-sm w-full" 
          >
            {repo}
          </a>
        ))}
      </div>
    </div>
  )}
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