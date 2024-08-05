import React , { useState, useRef , useEffect} from "react";
import { useAuth } from "../providers/auth";
import { API_URL } from "../config/settings";

export const MyPage = () => {
  const { currentUser, token } = useAuth();
  const [selectedRepo, setSelectedRepo] = useState("");
  const [readmeContent, setReadmeContent] = useState("");
  const [selectedReadme, setSelectedReadme] = useState("");
  const [interviewText, setInterviewText] = useState("");
  const [audioSrc, setAudioSrc] = useState(null);
  const [inputText, setInputText] = useState("こんにちは");
  const [error, setError] = useState(null);
  console.log(currentUser);

  //音声録音用
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const fetchReadme = async (repoName) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/github/readme/${repoName}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch README');
      }

      const data = await response.json();
      setReadmeContent(data.readme);
    } catch (error) {
      console.error("Error fetching README:", error);
      setReadmeContent("Failed to load README");
    }
  };

  const handleRepoSelect = (e) => {
    const repoName = e.target.value;
    setSelectedRepo(repoName);
    if (repoName) {
      fetchReadme(repoName);
    } else {
      setReadmeContent("");
    }
  };

  //面接機能
  const startInterview = async () => {
    console.log("README Content:", readmeContent); // この行を追加
  
    if (!readmeContent) {
      console.error("No README content to start interview");
      return;
    }
  
    try {
      const response = await fetch(`${API_URL}/api/v1/interview/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ readme: readmeContent })
      });

      const data = await response.json();
      setInterviewText(data.text);
      setAudioSrc(data.audio);
    } catch (error) {
      console.error("Error starting interview:", error);
    }
  };

  const continueInterview = async (userResponse) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/interview/continue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ user_response: userResponse })
      });

      if (!response.ok) {
        throw new Error('Failed to continue interview');
      }

      const data = await response.json();
      setInterviewText(data.text);
      setAudioSrc(data.audio);
    } catch (error) {
      console.error("Error continuing interview:", error);
    }
  };

  

  //録音用
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        audioChunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      setError("Failed to start recording. Please check your microphone permissions.");
    }
  };

  //録音ストップ
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  //録音バックエンドに送信
  const handleSendAudioToBackend = async () => {
    if (!audioBlob) return;
  
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recorded_audio.wav');
  
      const response = await fetch(`${API_URL}/api/v1/speech_to_text`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
  
      if (!response.ok) {
        throw new Error('Failed to send audio to backend');
      }
  
      const data = await response.json();
      console.log("Transcription received:", data.transcription);
    } catch (error) {
      console.error("Error sending audio to backend:", error);
      setError("Failed to process audio. Please try again.");
    }
  };

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
    return <p className="container max-w-6xl mx-auto py-5">Loading profile...</p>;
  }

  // 安全にプロパティにアクセスするためのチェックを追加
  return (
    <div className="container max-w-6xl mx-auto py-5">
      <h1>Interview Simulation</h1>
      <select onChange={handleRepoSelect} value={selectedRepo}>
        <option value="">Select a repository</option>
        {currentUser.github_repositories && currentUser.github_repositories.map((repoName, index) => (
          <option key={index} value={repoName}>{repoName}</option>
        ))}
      </select>
      {/*
      {readmeContent && (
        <div>
          <h2>README Preview:</h2>
          <pre className="mt-2 p-4 bg-gray-100 rounded">{readmeContent}</pre>
        </div>
      )}
      */}
      <button onClick={startInterview} disabled={!readmeContent} className="mt-4 btn btn-primary">
        Start Interview
      </button>

      {interviewText && (
        <div className="mt-4">
          <h2>Interview Question:</h2>
          <p>{interviewText}</p>
          {audioSrc && (
            <audio controls className="mt-2">
              <source src={audioSrc} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}
        </div>
      )}

      <div className="mt-4">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`btn ${isRecording ? 'btn-error' : 'btn-primary'}`}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        
        {audioBlob && (
          <button
            onClick={handleSendAudioToBackend}
            className="btn btn-secondary ml-2"
          >
            Send Response
          </button>
        )}
      </div>
      
      {audioBlob && (
        <audio controls className="mt-4">
          <source src={URL.createObjectURL(audioBlob)} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default MyPage;