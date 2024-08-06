import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../providers/auth";
import { API_URL } from "../config/settings";

export const Interview = () => {
  const { currentUser, token } = useAuth();
  const [selectedRepo, setSelectedRepo] = useState("");
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewText, setInterviewText] = useState("");
  const [audioSrc, setAudioSrc] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [audioKey, setAudioKey] = useState(0);

  useEffect(() => {
    if (currentUser !== undefined) {
      setIsLoading(false);
    }
  }, [currentUser]);

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
      console.log("README Content:", data.readme);
      return data.readme;
    } catch (error) {
      console.error("Error fetching README:", error);
      return "";
    }
  };

  const startInterview = async () => {
    const readme = await fetchReadme(selectedRepo);
    try {
      const response = await fetch(`${API_URL}/api/v1/interview/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ readme: readme })
      });

      if (!response.ok) {
        throw new Error('Failed to start interview');
      }

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

      if (!response.ok) {
        throw new Error('Failed to continue interview');
      }

      const data = await response.json();
      setInterviewText(data.text);
      setAudioSrc(data.audio);
      setMessages(data.messages);
      setAudioKey(prevKey => prevKey + 1);
      console.log(data.messages);
    } catch (error) {
      console.error("Error continuing interview:", error);
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
      await continueInterview(data.transcription);
      setAudioBlob(null);
      setAudioKey(prevKey => prevKey + 1);
    } catch (error) {
      console.error("Error sending audio to backend:", error);
    }
  };

  if (isLoading) {
    return <div>Loading user data...</div>;
  }

  if (!currentUser) {
    return <div>Please log in to access this page.</div>;
  }

  return (
    <div className="container max-w-6xl mx-auto py-5">
      <h1>Interview Simulation</h1>
      {!interviewStarted ? (
        <>
          <select onChange={(e) => setSelectedRepo(e.target.value)} value={selectedRepo}>
            <option value="">Select a repository</option>
            {currentUser.github_repositories && currentUser.github_repositories.map((repoName, index) => (
              <option key={index} value={repoName}>{repoName}</option>
            ))}
          </select>
          <button onClick={startInterview} disabled={!selectedRepo} className="mt-4 btn btn-primary">
            Start Interview
          </button>
        </>
      ) : (
        <>
          <div className="mt-4">
            <h2>Interview Question:</h2>
            <p>{interviewText}</p>
            {audioSrc && (
              <audio key={`ai-${audioKey}`} controls className="mt-2">
                <source src={audioSrc} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}
          </div>

          <div className="mt-4">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`btn ${isRecording ? 'btn-error' : 'btn-primary'}`}
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
            
            {audioBlob && (
              <>
                <button
                  onClick={handleSendAudioToBackend}
                  className="btn btn-secondary ml-2"
                >
                  Send Response
                </button>
                <audio key={`user-${audioKey}`} controls className="mt-4">
                  <source src={URL.createObjectURL(audioBlob)} type="audio/wav" />
                  Your browser does not support the audio element.
                </audio>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Interview;