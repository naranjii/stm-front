import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();
  const { login, logout } = useContext(AuthContext);
    useEffect(() => {
      logout()
    }, []);

  const handleSingIn = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, senha }),
      });

      const data = await response.json();

      if (!response.ok || !data.token) {
        throw new Error(data.error|| 'Bad login :(');
      }

      login(data.token);
      navigate('/dashboard');
      console.log(data.token)
    } catch (err) {
      setErro(err.message);
    }
  };

  const handleSignUp = async () => {
    setErro('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, senha }),
      });
      const data = await response.json();
      if (!response.ok) {
      throw new Error(data.error || 'Bad register :(');
      }

      login(data.token);
      navigate('/dashboard');
      console.log(data.token);
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-green-600
     bgbox text-green-700 font-medium rounded-xl p-4 w-110 mx-auto space-y-4 mt-6 containershadow">
        <h2 className="drop-shadow-[0_0px_2px_green] submit text-teal-100 text-[24px] font-bold text-center underline
        tracking-[2px] underline-offset-5 mb-0">
          &nbsp; 🍃&nbsp;starred-task-manager&nbsp;🍃&nbsp;
          </h2>
        <div className="drop-shadow-[0_0px_1px_green] submit text-green-200 text-[19px] text-center
        tracking-[1px]">
          submit access
        </div>
          <div style={{ minHeight: 10 }} className="mb-3">
          {erro && <p className="text-red-800 text-sm m-0 p-0 leading-tight  text-center">{erro}</p>}
        </div>
        <form>
          <input
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mb-1 p-2 pl-5 formbg border rounded"
          />
          <input
            type="password"
            placeholder="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full p-2 pl-5 formbg border rounded"
          />
        </form>
        <div className="justify-center items-center flex flex-col">

          <button className="w-35 mb-2 text-green signbutton" 
          type="button" 
          onClick={handleSingIn}>
            sign in
          </button>

          <button
          className="mt-0 w-35 text-green signbutton"
          type="button"
          onClick={handleSignUp}>
          sign up
          </button>

        </div>
      </div>
  );
}
