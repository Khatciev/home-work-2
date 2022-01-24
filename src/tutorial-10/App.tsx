import React, { useState } from "react";
import "./App.css";
import axios from "axios";
type User = {
  id: number;
  login: string;
  name: string;
  avatar_url: string;
  location: string;
  public_repos: number;
  twitter_username: string | null;
  bio: string;
  followers: number;
  following: number;
  html_url: string;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // если ты по умолчанию передаешь "" в стейт, то можно не писать явно string
  // так и для других типов данных. если нет значения по умолчанию, тогда указывай тип

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const loadUser = async (name: string) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`https://api.github.com/users/${name}`);
      if (data.message) {
        setError(data.message);
      }
      setUser(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h1>Загрузка.....</h1>;
  }
  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div id="app">
      <div className="app-container">
        <form className="app-form">
          <input
            value={search}
            onChange={handleChangeInput}
            type="text"
            className="app-input"
            placeholder="Укажите GitHub-аккаунт"
          />
          <button onClick={() => loadUser(search)} className="app-form_btn">
            Найти
          </button>{" "}
          <br />
        </form>
        <div className="app-user">
          <div className="app-user_info">
            <div className="app-user_image">
              <img src={user?.avatar_url} alt="" />
            </div>
            <div className="app-user_data">
              <h1 className="app-user_name">
                {user?.login} {user?.name}
              </h1>
              <p className="app-user_about">{user?.bio}</p>
            </div>
          </div>
          <ul className="app-user_stats">
            <li className="app-user_stats-item">
              Репозитории
              <span>{user?.public_repos}</span>
            </li>
            <li className="app-user_stats-item">
              Подписчиков
              <span>{user?.followers}</span>
            </li>
            <li className="app-user_stats-item">
              Подписок
              <span>{user?.following}</span>
            </li>
          </ul>
          <ul className="app-user_location">
            <li className="app-user_location-item">{user?.location}</li>
            <li className="app-user_location-item">
              <a href={user?.html_url}>{user?.html_url}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
