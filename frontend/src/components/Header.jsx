import { useAuth } from "providers/auth";
import { RoutePath } from "config/route_path";
import { Link, useNavigate } from "react-router-dom";
import { memo, useEffect, useState } from "react";

export const Header = memo(() => {
    const { setToken, logout, currentUser } = useAuth();
    const navigate = useNavigate();
    const [currentTheme, setCurrentTheme] = useState("corporate"); // デフォルトテーマを設定
    const themes =  [
      "light",
      "dark",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "valentine",
      "fantasy",
      "wireframe",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "coffee",
      "nord",
    ];
    const handleThemeChange = (event) => {
      const newTheme = event.target.value;
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme); // テーマをローカルストレージに保存
      setCurrentTheme(newTheme);
    };
  
    useEffect(() => {
      setToken(localStorage.getItem("authToken"));
      
      // ローカルストレージからテーマを読み取って適用
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        setCurrentTheme(savedTheme);
      }
    }, [setToken]);
  
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
            インタービューシミュレータ
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
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn m-1">
            theme
            <svg width="12px" height="12px" className="ml-2 h-4 w-4 fill-current opacity-60 inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
            <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
            </svg>
          </div>
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-50">
            {themes.map(theme => (
              <li key={theme}>
                <input
                  type="radio"
                  name="theme-dropdown"
                  className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                  aria-label={theme}
                  value={theme}
                  onChange={handleThemeChange}
                />
              </li>
            ))}
          </ul>
        </div>
      </header>
    );
  });