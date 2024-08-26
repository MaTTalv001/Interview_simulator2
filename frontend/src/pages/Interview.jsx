import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../providers/auth";
import { Link } from "react-router-dom";
import { API_URL } from "../config/settings";
import { generalQuestions } from "../utils/generalQuestions";
import { FaMicrophone, FaPaperPlane, FaToggleOn, FaPlay, FaStop, FaToggleOff } from 'react-icons/fa';

const interviewers = [
  {
    id: 1,
    name: "AI採用担当者",
    video: "/movie/interview.mp4",
    thumbnail: "/interviewer/interviewer01.jpg"
  }
];

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
  const [isPlaying, setIsPlaying] = useState(false);
  const audioPlayerRef = useRef(null);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [showUpdateMessage, setShowUpdateMessage] = useState(false);
  const [selectedInterviewer, setSelectedInterviewer] = useState(interviewers[0]);
  const [isFeedbackTextVisible, setIsFeedbackTextVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  

  const requestMicrophonePermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("マイクの権限が許可されました");
    } catch (error) {
      console.error("マイクの権限が拒否されました:", error);
    }
  };

  useEffect(() => {
    if (audioSrc) {
      setIsAudioReady(true);
    }
  }, [audioSrc]);

  useEffect(() => {
    if (isFeedbackReady && feedbackAudio) {
      setIsAudioReady(true);
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
      videoPlayer.loop = true;
      videoPlayer.currentTime = 0;
      audioPlayer.currentTime = 0;
      
      const playPromise = videoPlayer.play();
      if (playPromise !== undefined) {
        playPromise.then(_ => {
          audioPlayer.play().catch(e => console.error("Error playing audio:", e));
        }).catch(e => console.error("Error playing video:", e));
      }
      
      setIsPlaying(true);

      audioPlayer.onended = () => {
        videoPlayer.pause();
        setIsPlaying(false);
      };
      
      videoPlayer.onended = () => {
        if (!audioPlayer.ended) {
          videoPlayer.currentTime = 0;
          videoPlayer.play().catch(e => console.error("Error replaying video:", e));
        }
      };
    } else {
      console.error("Video or audio player is not ready.");
    }
  };

  const pauseAudioAndVideo = () => {
    const videoPlayer = videoRef.current;
    const audioPlayer = audioRef.current;
    if (videoPlayer && audioPlayer) {
      videoPlayer.pause();
      audioPlayer.pause();
      setIsPlaying(false);
    }
  };

  const startRecording = async () => {
    await requestMicrophonePermission();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log("音声データを受信:", event.data.size, "バイト");
        }
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp4' });
        setAudioBlob(audioBlob);
        audioChunksRef.current = [];
        setIsPlaying(false); 
        console.log("録音完了。Blobサイズ:", audioBlob.size, "バイト");
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsPlaying(false);
      console.log("録音開始");
    } catch (error) {
      console.error("録音開始エラー:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPlaying(false);
      console.log("録音停止");
    }
  };

  const playRecording = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioPlayerRef.current.src = audioUrl;
      audioPlayerRef.current.play().then(() => {
        console.log("再生開始");
        setIsPlaying(true);
      }).catch(error => {
        console.error("再生エラー:", error);
      });
    }
  };

  const stopPlaying = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
      setIsPlaying(false);
      console.log("再生停止");
    }
  };

  const handleSendAudioToBackend = async () => {
    if (!audioBlob) return;
    setIsSending(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recorded_audio.mp4');
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
      setIsAudioReady(true);
      setIsPlaying(false);
      setShowUpdateMessage(true);
      setTimeout(() => setShowUpdateMessage(false), 3000); // 3秒後にメッセージを非表示にする
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
      if (!response.ok) throw new Error('面接終了に失敗しました');
      const data = await response.json();
      setFeedbackText(data.text);
      setFeedbackAudio(data.audio);
      setIsInterviewEnded(true);
      setIsFeedbackReady(true);
      setIsAudioReady(true);
      setIsPlaying(false);
      console.log(messages);
      console.log(data.text);
    } catch (error) {
      console.error("面接終了に失敗しました", error);
    } finally {
      setIsPreparingFeedback(false);
    }
  };

  const formatConversation = (messages) => {
    // ログを保存する際に最初の2つのメッセージ（system と 最初の user）をスキップ
    const relevantMessages = messages.slice(2);
    
    return relevantMessages.map(message => 
      `${message.role}: ${message.content}`
    ).join('\n');
  };

  const saveInterview = async () => {
    try {
      const formattedConversation = formatConversation(messages);
      
      const response = await fetch(`${API_URL}/api/v1/interview_logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          interview_log: {
            body: formattedConversation,
            feedback: feedbackText
          }
        })
      });
      
      if (!response.ok) throw new Error('Failed to save interview log');
      const data = await response.json();
      console.log('Interview log saved successfully', data);
      setIsSaved(true);  // 保存成功時に状態を更新
    } catch (error) {
      console.error("Error saving interview log:", error);
    }
  };

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
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">面接練習</h1>
      <Link to={`/MyPage`} className="btn btn-ghost">
        マイページへ
      </Link>
    </div>
      
      
    {!interviewMode && (
      <>
        <h2 className="text-xl font-semibold mb-10">練習モードを選択してください：</h2>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <button onClick={() => setInterviewMode('portfolio')} className="btn btn-primary btn-lg w-full sm:w-auto">
            PFを話題に面接を受ける
          </button>
          <button onClick={() => setInterviewMode('general')} className="btn btn-secondary btn-lg w-full sm:w-auto">
            よくある質問で面接を受ける
          </button>
        </div>
      </>
    )}

    {interviewMode && !interviewStarted && (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">面接担当者を選択してください：</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {interviewers.map((interviewer) => (
          <div key={interviewer.id} className="w-48 text-center">
            <img 
              src={interviewer.thumbnail} 
              alt={interviewer.name} 
              className="w-full h-48 object-cover mb-2 rounded"
            />
            <p className="font-medium">{interviewer.name}</p>
            <input 
              type="radio" 
              name="interviewer" 
              value={interviewer.id} 
              checked={selectedInterviewer.id === interviewer.id}
              onChange={() => setSelectedInterviewer(interviewer)}
              className="radio radio-primary mt-2"
            />
          </div>
        ))}
      </div>
    </div>
    )}

    {interviewMode === 'portfolio' && !interviewStarted && (
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">リポジトリのREADMEを解析して質問を生成します</h2>
        <select 
          onChange={(e) => setSelectedRepo(e.target.value)} 
          value={selectedRepo}
          className="select select-bordered w-full mb-4"
        >
        <option value="">リポジトリを選択</option>
        {currentUser.github_repositories && currentUser.github_repositories.map((repoName, index) => (
          <option key={index} value={repoName}>{repoName}</option>
          ))}
        </select>
        <button 
          onClick={startInterviewWithRepo} 
          disabled={!selectedRepo} 
          className="btn btn-primary w-4/5 mx-auto block"
        >
          選択したリポジトリで面接を開始する
        </button>
      </div>
    )}

    {interviewMode === 'general' && !interviewStarted && (
      <button 
        onClick={startGeneralInterview} 
        className="btn btn-primary w-4/5 mx-auto block"
      >
        よくある質問で面接を開始する
      </button>
    )}

    {isLoading && (
      <div className="text-center">
        <span className="mt-4 loading loading-spinner loading-lg"></span>
        <p className="mt-4">面接を準備中です...</p>
      </div>
    )}

    {isPreparingFeedback && (
      <div className="text-center">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="mt-10">フィードバックを準備しています...</p>
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
        <audio ref={audioRef} key={`ai-${audioKey}`} style={{display: 'none'}}>
          <source src={audioSrc} type="audio/mpeg" />
            ブラウザが音声再生に対応していません。環境を変えてお試しください
        </audio>
        <video 
          ref={videoRef}
          width="100%"
          height="auto"
          muted
          playsInline
          loop
          className="mb-4"
        >
          <source src="/movie/interview.mp4" type="video/mp4" />
            ブラウザが動画再生に対応していません。環境を変えてお試しください
        </video>

      {isAudioReady && (
        <div className="mb-4 flex justify-center">
          <button
            onClick={isPlaying ? pauseAudioAndVideo : playAudioWithVideo}
            className={`btn ${isPlaying ? 'btn-error btn-outline' : 'btn-primary'} w-4/5`}
          >
            {isPlaying ? <FaStop className="mr-2" /> : <FaPlay className="mr-2" />}
            {isPlaying ? '停止' : '質問を再生する'}
          </button>
        </div>
      )}


      <div className="space-y-4">
        {!audioBlob && !isSending && (
        <div className="mb-4 flex justify-center">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`btn ${isRecording ? 'btn-error btn-outline' : 'btn-secondary'} w-4/5`}
          >
            <FaMicrophone className="mr-2" />
            {isRecording ? '録音を停止' : 'マイクで回答する'}
          </button>
        </div>
        )}

        {audioBlob && !isSending && (
        <div className="flex space-x-4">
          <button
            onClick={isPlaying ? stopPlaying : playRecording}
            className="btn btn-secondary flex-1"
          >
            {isPlaying ? <FaStop className="mr-2" /> : <FaPlay className="mr-2" />}
            {isPlaying ? '再生を停止' : '録音を確認する'}
          </button>
          <button
            onClick={handleSendAudioToBackend}
            className="btn btn-secondary flex-1"
          >
          <FaPaperPlane className="mr-2" />
            送信する
          </button>
        </div>
        )}
        {isSending && (
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
            <p className="mt-4">あなたの回答を送信しています...</p>
        </div>
        )}
      </div>

      <audio ref={audioPlayerRef} style={{ display: 'none' }} />

      {audioBlob && (
      <div className="mt-4">
        <p>録音が完了しました。上のボタンから確認または送信できます。</p>
          {/*<p>録音サイズ: {audioBlob.size} バイト</p>*/}
      </div>
      )}

      <div className="mt-4">
        <button onClick={endInterview} className="btn btn-accent w-4/5 mx-auto block">
          面接を終える
        </button>
      </div>
    </div>
    )}
      {showUpdateMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-primary text-white px-6 py-4 rounded-lg shadow-lg animate-bounce">
            <p className="text-lg font-semibold">会話が更新されました。再生ボタンを押してください。</p>
          </div>
        </div>
      )}

      {isInterviewEnded && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">面接フィードバック:</h2>
            <button onClick={() => setIsFeedbackTextVisible(!isFeedbackTextVisible)} className="btn btn-ghost">
              {isFeedbackTextVisible ? <FaToggleOn /> : <FaToggleOff />} テキストを表示
            </button>
          </div>
          {isFeedbackTextVisible && <p className="mb-4">{feedbackText}</p>}
          <audio 
            ref={audioRef} 
            style={{display: 'none'}}
            onCanPlayThrough={() => setIsFeedbackReady(true)}
          >
            <source src={feedbackAudio} type="audio/mpeg" />
            ブラウザが音声再生に対応していません。環境を変えてお試しください
          </audio>
          <video 
            ref={videoRef}
            width="640"
            height="360"
            muted
            playsInline
            className="w-full mt-4"
          >
            <source src={selectedInterviewer.video} type="video/mp4" />
            ブラウザが動画再生に対応していません。環境を変えてお試しください
          </video>
          
          {isAudioReady && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={isPlaying ? pauseAudioAndVideo : playAudioWithVideo}
                className={`btn ${isPlaying ? 'btn-error btn-outline' : 'btn-primary'} flex items-center w-4/5 mx-auto block`}
              >
                {isPlaying ? <FaStop className="mr-2" /> : <FaPlay className="mr-2" />}
                {isPlaying ? '停止' : 'フィードバックを再生'}
              </button>
            </div>
          )}
          <div className="mt-4 flex justify-center">
          {!isSaved ? (
            <button
              onClick={saveInterview}
              className="btn btn-accent w-4/5 mx-auto block"
            >
              面接記録を保存する
            </button>
          ) : (
            <Link
              to="/Logs"
              className="btn btn-accent w-4/5 mx-auto flex items-center justify-center"
            >
              振り返りページへ
            </Link>
          )}
        </div>
        </div>
      )}
    </div>
  );
};

export default Interview;