import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../providers/auth";
import { API_URL } from "../config/settings";
import { generalQuestions } from "../utils/generalQuestions";
import { FaMicrophone, FaPaperPlane, FaToggleOn, FaToggleOff, FaPlay } from 'react-icons/fa';

export const Interview = () => {
  const { currentUser, token } = useAuth();
  const [selectedRepo, setSelectedRepo] = useState("");
  const [interviewMode, setInterviewMode] = useState(null);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewText, setInterviewText] = useState("");
  const [audioSrc, setAudioSrc] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [audioKey, setAudioKey] = useState(0);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [isInterviewEnded, setIsInterviewEnded] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackAudio, setFeedbackAudio] = useState(null);
  const [isFeedbackReady, setIsFeedbackReady] = useState(false);
  const [isTextVisible, setIsTextVisible] = useState(false);
  const [isPreparingFeedback, setIsPreparingFeedback] = useState(false);
  const [isMediaReady, setIsMediaReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (audioSrc) {
      const audioPlayer = audioRef.current;
      if (audioPlayer) {
        audioPlayer.src = audioSrc;
        audioPlayer.load();
        setIsMediaReady(true);
        setIsPlaying(false);
      }
    }
  }, [audioSrc]);

  useEffect(() => {
    if (isFeedbackReady && feedbackAudio) {
      playAudioWithVideo();
    }
  }, [isFeedbackReady, feedbackAudio]);

  const fetchReadme = async (repoName) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/github/readme/${repoName}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch README');
      const data = await response.json();
      return data.readme;
    } catch (error) {
      console.error("Error fetching README:", error);
      return "";
    }
  };

  const startInterviewWithRepo = async () => {
    setIsLoading(true);
    try {
      const readme = await fetchReadme(selectedRepo);
      await startInterview(readme);
    } catch (error) {
      console.error("Error starting interview with repo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startGeneralInterview = async () => {
    setIsLoading(true);
    try {
      const randomQuestion = generalQuestions[Math.floor(Math.random() * generalQuestions.length)];
      await startInterview(randomQuestion);
    } catch (error) {
      console.error("Error starting general interview:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startInterview = async (prompt) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/interview/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ readme: prompt })
      });
      if (!response.ok) throw new Error('Failed to start interview');
      const data = await response.json();
      setInterviewText(data.text);
      setAudioSrc(data.audio);
      setMessages(data.messages);
      setInterviewStarted(true);
      setAudioKey(prevKey => prevKey + 1);
    } catch (error) {
      console.error("Error starting interview:", error);
    }
  };

  const playAudioWithVideo = () => {
    const videoPlayer = videoRef.current;
    const audioPlayer = audioRef.current;
    if (videoPlayer && audioPlayer) {
      videoPlayer.muted = true;
      videoPlayer.loop = false;

      const playMedia = () => {
        videoPlayer.currentTime = 0;
        audioPlayer.currentTime = 0;
        
        videoPlayer.play().then(() => {
          setTimeout(() => {
            audioPlayer.play().catch(e => {
              console.error("Error playing audio:", e);
              setIsPlaying(false);
              setIsMediaReady(true);
            });
          }, 1000);
        }).catch(e => console.error("Error playing video:", e));
        
        setIsPlaying(true);
      };

      const stopMedia = () => {
        videoPlayer.pause();
        audioPlayer.pause();
        setIsPlaying(false);
        setIsMediaReady(true);
      };

      audioPlayer.onended = stopMedia;

      if (videoPlayer.readyState >= 2 && audioPlayer.readyState >= 2) {
        playMedia();
      } else {
        videoPlayer.oncanplay = playMedia;
        audioPlayer.oncanplay = playMedia;
      }
    } else {
      console.error("Video or audio player is not ready.");
    }
  };

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
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSendAudioToBackend = async () => {
    if (!audioBlob) return;
    setIsSending(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recorded_audio.wav');
      const response = await fetch(`${API_URL}/api/v1/speech_to_text`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (!response.ok) throw new Error('Failed to send audio to backend');
      const data = await response.json();
      await continueInterview(data.transcription);
      setAudioBlob(null);
      setAudioKey(prevKey => prevKey + 1);
    } catch (error) {
      console.error("Error sending audio to backend:", error);
    } finally {
      setIsSending(false);
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
        body: JSON.stringify({ messages: messages, user_response: userResponse })
      });
      if (!response.ok) throw new Error('Failed to continue interview');
      const data = await response.json();
      setInterviewText(data.text);
      setAudioSrc(data.audio);
      setMessages(data.messages);
      setAudioKey(prevKey => prevKey + 1);
    } catch (error) {
      console.error("Error continuing interview:", error);
    }
  };

  const endInterview = async () => {
    setIsPreparingFeedback(true);
    try {
      const response = await fetch(`${API_URL}/api/v1/interview/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ messages })
      });
      if (!response.ok) throw new Error('Failed to end interview');
      const data = await response.json();
      setFeedbackText(data.text);
      setFeedbackAudio(data.audio);
      setIsInterviewEnded(true);
      setIsFeedbackReady(true);
    } catch (error) {
      console.error("Error ending interview:", error);
    } finally {
      setIsPreparingFeedback(false);
    }
  };

  if (!currentUser) {
    return <div className="text-center">Please log in to access this page.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">面接シミュレーション</h1>
      
      {!interviewMode && (
        <div className="flex justify-center space-x-4 mb-6">
          <button onClick={() => setInterviewMode('portfolio')} className="btn btn-primary btn-lg">
            ポートフォリオを話題に面接を受ける
          </button>
          <button onClick={() => setInterviewMode('general')} className="btn btn-secondary btn-lg">
            汎用的な面接を受ける
          </button>
        </div>
      )}

      {interviewMode === 'portfolio' && !interviewStarted && (
        <div className="mb-6">
          <select 
            onChange={(e) => setSelectedRepo(e.target.value)} 
            value={selectedRepo}
            className="select select-bordered w-full max-w-xs"
          >
            <option value="">リポジトリを選択</option>
            {currentUser.github_repositories && currentUser.github_repositories.map((repoName, index) => (
              <option key={index} value={repoName}>{repoName}</option>
            ))}
          </select>
          <button 
            onClick={startInterviewWithRepo} 
            disabled={!selectedRepo} 
            className="btn btn-primary mt-4"
          >
            選択したリポジトリで面接を開始
          </button>
        </div>
      )}

      {interviewMode === 'general' && !interviewStarted && (
        <button 
          onClick={startGeneralInterview} 
          className="btn btn-primary"
        >
          汎用的な面接を開始
        </button>
      )}

      {isLoading && (
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4">面接を準備中です...</p>
        </div>
      )}

      {isPreparingFeedback && (
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4">フィードバックを準備しています...</p>
        </div>
      )}

      {interviewStarted && !isInterviewEnded && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">面接質問:</h2>
            <button onClick={() => setIsTextVisible(!isTextVisible)} className="btn btn-ghost">
              {isTextVisible ? <FaToggleOn /> : <FaToggleOff />} テキストを表示
            </button>
          </div>
          {isTextVisible && <p className="mb-4">{interviewText}</p>}
          <div className="relative">
            <audio ref={audioRef} style={{display: 'none'}}>
              <source src={audioSrc} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <video 
              ref={videoRef}
              width="640"
              height="360"
              muted
              playsInline
              className="w-full"
            >
              <source src="/movie/interview.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {isMediaReady && !isPlaying && (
              <button 
                onClick={playAudioWithVideo} 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 btn btn-circle btn-lg"
              >
                <FaPlay className="text-3xl" />
              </button>
            )}
          </div>

          <div className="mt-6 flex justify-center">
            {!audioBlob && !isSending && (
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`btn ${isRecording ? 'btn-error' : 'btn-primary'} flex items-center`}
              >
                <FaMicrophone className="mr-2" />
                {isRecording ? '録音を停止' : 'マイクで回答する'}
              </button>
            )}
            {audioBlob && !isSending && (
              <button
                onClick={handleSendAudioToBackend}
                className="btn btn-primary flex items-center"
              >
                <FaPaperPlane className="mr-2" />
                送信する
              </button>
            )}
            {isSending && (
              <div className="text-center">
                <span className="loading loading-spinner loading-md"></span>
                <p className="mt-2">あなたの回答を送信しています...</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-center">
            <button onClick={endInterview} className="btn btn-warning">
              面接を終える
            </button>
          </div>
        </div>
      )}

{isInterviewEnded && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">面接フィードバック:</h2>
          <p>{feedbackText}</p>
          <div className="relative mt-4">
            <audio 
              ref={audioRef} 
              style={{display: 'none'}}
              onCanPlayThrough={() => setIsFeedbackReady(true)}
            >
              <source src={feedbackAudio} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <video 
              ref={videoRef}
              width="640"
              height="360"
              muted
              playsInline
              className="w-full"
            >
              <source src="/movie/interview.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {isMediaReady && !isPlaying && (
              <button 
                onClick={playAudioWithVideo} 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 btn btn-circle btn-lg"
              >
                <FaPlay className="text-3xl" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Interview;