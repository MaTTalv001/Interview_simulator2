import React, { useState, useEffect } from 'react';
import { useAuth } from "../providers/auth";
import AvatarModal from '../components/AvatarModal';
import { Link } from 'react-router-dom';
import { API_URL } from "../config/settings";
import { IconContext } from 'react-icons'
import { FaGithub , FaTwitter} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export const MyPage = () => {
  const { currentUser, setCurrentUser, token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [avatars, setAvatars] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [isRepoListOpen, setIsRepoListOpen] = useState(false);

  useEffect(() => {
    if (currentUser !== undefined && token) {
      setIsLoading(false);
      fetchAvatars();
      fetchExperiences();
    }
  }, [currentUser, token]);

  const fetchAvatars = async () => {
    if (!token) return;
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
  
  const fetchExperiences = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/api/v1/experiences`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error('経験情報の取得に失敗しました');
      }
  
      const data = await response.json();
      setExperiences(data);
    } catch (error) {
      console.error('経験情報の取得に失敗しました', error);
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
        throw new Error('経験情報の更新に失敗しました');
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

  const handleTweet = () => {
    const url = "https://interview-frontend-05a5d7363eca.herokuapp.com/";
    const tweetText = "AIで面接のイメージトレーニングしよう！ #面接シミュレータR #RUNTEQ #RUNTEQ祭";
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(tweetText)}`;
    window.open(twitterUrl, "_blank");
  };

  return (
    <div className="container mx-auto mt-10 p-4 max-w-3xl">
      <div className="card lg:card-side bg-base-100 shadow-xl mb-8">
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
          
          <div className="mt-8 flex justify-center space-x-4">
            <Link to="/Interview" className="btn btn-lg btn-primary">
              面接練習
            </Link>
            <Link to="/Logs" className="btn btn-lg btn-primary">
              練習ログ
            </Link>
            {/* <Link to="/Sharings" className="btn btn-lg btn-primary">
              情報交換
            </Link> */}
          </div>
          <div className="card bg-base-100">
        <div className="card-body text-center">
          {/* <h3 className="text-md font-bold mb-2">面接シミュレータRをみんなに教える</h3> */}
          <button 
            onClick={handleTweet} 
            className="btn btn-accent btn-md mx-auto flex items-center"
          >
            <IconContext.Provider value={{size: '24px', className: 'mr-2'}}>
              <FaXTwitter />
            </IconContext.Provider>
            アプリをシェア
          </button>
        </div>
      </div>
        </div>
      </div>
      
      {/* リポジトリ表示/非表示セクション */}
      {/* <div className="card bg-base-100 ">
        <div className="card-body">
          <button 
            onClick={toggleRepoList} 
            className="btn btn-outline btn-secondary mx-auto block" 
          >
            {isRepoListOpen ? 'リポジトリを隠す' : 'リポジトリを表示'}
          </button>
          {isRepoListOpen && (
            <div className="mt-4">
              <h3 className="text-xl font-bold mb-2">Repositories</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2"> 
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
      </div> */}

      {/* <div className="card bg-base-100">
        <div className="card-body text-center">
          <button 
            onClick={handleTweet} 
            className="btn btn-accent btn-md mx-auto flex items-center"
          >
            <IconContext.Provider value={{size: '24px', className: 'mr-2'}}>
              <FaXTwitter />
            </IconContext.Provider>
            アプリをシェア
          </button>
        </div>
      </div> */}
  
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