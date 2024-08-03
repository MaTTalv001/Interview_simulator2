import { useAuth } from "providers/auth";
import { RoutePath } from "config/route_path";
import { Link, useNavigate } from "react-router-dom";
import { memo, useEffect, useState } from "react";

export const Header = memo(() => {
    const { setToken, logout, currentUser } = useAuth();
    const navigate = useNavigate();
  
    useEffect(() => {
      setToken(localStorage.getItem("authToken"));
    }, [localStorage.getItem("authToken")]);
  
    const handleClickLogout = () => {
      logout(); // トークンをクリアしてログアウト処理
      console.log("logout");
      navigate(RoutePath.Home.path); // ログインページにリダイレクト
    };
  
    return (
      <header className="navbar bg-base-300 relative z-50">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link
                  to="/MyPage"
                  className={`btn btn-ghost normal-case text-xl ${
                    !currentUser && "btn-disabled"
                  }`}
                >
                  マイページ
                </Link>
              </li>
              
              
              
              {currentUser && (
                <>
                  
  
                  <li>
                    <a
                      onClick={handleClickLogout}
                      className="btn btn-ghost normal-case text-xl"
                    >
                      ログアウト
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
        <div className="navbar-center">
          <Link to="/" className="btn btn-ghost normal-case text-xl md:text-2xl">
            3日目に魔王がいる
          </Link>
        </div>
        <div className="navbar-end">
          {currentUser && (
            <div className="flex items-center">
              <span className="text-sm md:text-md mr-2 stat-value">
              </span>
              <span className="hidden md:inline-block text-lg mr-2 px-2 bg-secondary rounded-md">
                {currentUser.nickname}
              </span>
            </div>
          )}
        </div>
      </header>
    );
  });