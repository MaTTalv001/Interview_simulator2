import React , { useState } from "react";
import { useAuth } from "../providers/auth";
import { API_URL } from "../config/settings";

export const MyPage = () => {
  const { currentUser, token } = useAuth();
  const [audioSrc, setAudioSrc] = useState(null);
  const [inputText, setInputText] = useState("こんにちは");
  const [error, setError] = useState(null);
  console.log(currentUser);

  const handleGenerateSpeech = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/text_to_speech/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: inputText })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Network response was not ok');
      }
  
      const data = await response.json();
      setAudioSrc(data.audio_data);
    } catch (error) {
      console.error("Error generating speech:", error);
      // ここでユーザーにエラーメッセージを表示する処理を追加
    }
  };

  // currentUserがnullまたはundefinedの場合、ローディングを表示
  if (!currentUser) {
    return <p>Loading profile...</p>;
  }

  // 安全にプロパティにアクセスするためのチェックを追加
  return (
    <div>
      <h1>My Profile</h1>
      <p>ID: {currentUser.id}</p>
      <p>Nickname: {currentUser.nickname}</p>
      {currentUser.avatar && (
        <img src={currentUser.avatar.avatar_url} alt="User Avatar" />
      )}
      <h2>GitHub Repositories</h2>
      {currentUser.github_repositories && currentUser.github_repositories.length > 0 ? (
        <ul>
          {currentUser.github_repositories.map((repoName, index) => (
            <li key={index}>{repoName}</li>
          ))}
        </ul>
      ) : (
        <p>No repositories found.</p>
      )}
      <div>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text to generate speech"
        />
        <button onClick={handleGenerateSpeech}>Generate Speech</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {audioSrc && (
        <audio controls>
          <source src={audioSrc} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};
export default MyPage;
