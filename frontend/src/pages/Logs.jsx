import React, { useState, useRef, useEffect } from "react";
import { FaMicrophone, FaPaperPlane, FaPlay, FaStop } from 'react-icons/fa';

export const Logs = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioPlayerRef = useRef(null);

  const requestMicrophonePermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("マイクの権限が許可されました");
    } catch (error) {
      console.error("マイクの権限が拒否されました:", error);
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
          console.log("音声データを受信:", event.data.size, "バイト ");
        }
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp4' });
        setAudioBlob(audioBlob);
        audioChunksRef.current = [];
        console.log("録音完了。Blobサイズ:", audioBlob.size, "バイト");
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
      console.log("録音開始");
    } catch (error) {
      console.error("録音開始エラー:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
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

  useEffect(() => {
    return () => {
      if (audioPlayerRef.current) {
        URL.revokeObjectURL(audioPlayerRef.current.src);
      }
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">音声録音とログ</h1>

      <div className="mt-6 flex justify-center space-x-4">
        {!audioBlob && (
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`btn ${isRecording ? 'btn-error' : 'btn-primary'} flex items-center`}
          >
            <FaMicrophone className="mr-2" />
            {isRecording ? '録音を停止' : '録音を開始'}
          </button>
        )}
        {audioBlob && (
          <>
            <button
              onClick={isPlaying ? stopPlaying : playRecording}
              className="btn btn-secondary flex items-center"
            >
              {isPlaying ? <FaStop className="mr-2" /> : <FaPlay className="mr-2" />}
              {isPlaying ? '再生を停止' : '再生する'}
            </button>
            <button
              onClick={() => {/* ここに送信ロジックを追加 */}}
              className="btn btn-primary flex items-center"
            >
              <FaPaperPlane className="mr-2" />
              送信する
            </button>
          </>
        )}
      </div>

      <audio ref={audioPlayerRef} style={{ display: 'none' }} />

      {audioBlob && (
        <div className="mt-4">
          <p>録音が完了しました。上のボタンから再生または送信できます。</p>
          <p>録音サイズ: {audioBlob.size} バイト</p>
        </div>
      )}
    </div>
  );
};

export default Logs;