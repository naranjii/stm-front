import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../utils/draggable';
import TaskPanel from '../components/TaskDashboard/TaskPanel';

'use client';

export default function TaskDashboard() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div id="draggable" className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-green-300 containershadow bgbox
       text-green-700 font-medium rounded-xl p-4 max-w-x2 mx-auto space-y-4 mt-6">
      <TaskPanel />
      <div className="text-center">
        <button
          onClick={() => {
            logout(); // Remove o token
            navigate('/login'); // Redireciona para login
          }}
          className="text-sm text-gray-500 hover:underline exitbutton"
        >
          Exit
        </button>
      </div>
    </div>
  );
}