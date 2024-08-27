import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/auth";
import { RoutePath } from "../config/route_path";
import { API_URL } from "../config/settings";
import { FaGithub } from 'react-icons/fa'; // GitHub アイコンのインポート

export const HomePage = () => {
  const navigate = useNavigate();
  const { setToken, currentUser } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      setToken(token);
      localStorage.setItem("auth", token);
      navigate(RoutePath.UsersNew.path);
    }
  }, [setToken, navigate]);

  const handleGithubAuth = (e) => {
    e.preventDefault();
    const form = document.createElement("form");
    form.method = "GET";
    form.action = `${API_URL}/auth/github`;
    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-3xl">
          <img src="/title.jpg" alt="面接シミュレータR" className="max-w-sm mx-auto mb-8 rounded-lg shadow-2xl" />
          <h1 className="text-5xl font-bold mb-8">面接シミュレータR</h1>
          <p className="text-xl mb-8">
            AIを活用した面接練習アプリ
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleGithubAuth}
          >
            <FaGithub className="mr-2" /> GitHubでログイン
          </button>
        </div>
      </div>
    </div>
  );
};