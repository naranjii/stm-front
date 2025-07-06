import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function TaskDashboard() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [novaTask, setNovaTask] = useState('');
  const [dataLimite, setDataLimite] = useState('');
  const [horaLimite, setHoraLimite] = useState('');
  const [erro, setErro] = useState('');
  const [concluida, setConcluida] = useState(false);

  const token = localStorage.getItem('token');

  const carregarTasks = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setTasks(data);
      console.log('Tasks carregadas:', tasks);
    } catch (err) {
      setErro('Erro ao carregar tarefas');
    }
  };

  useEffect(() => {
    carregarTasks();
  }, []);

  const criarTask = async () => {
    if (!novaTask) return;
    try {
      // Combina data e hora em um único campo ISO
      let prazo = dataLimite;
      if (dataLimite && horaLimite) {
        prazo = `${dataLimite}T${horaLimite}`;
      }
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome: novaTask, prazo }),
      });
      if (!res.ok) throw new Error();
      setNovaTask('');
      setDataLimite('');
      setHoraLimite('');
      setConcluida('')
      carregarTasks();
    } catch {
      setErro('Erro ao criar tarefa');
    }
  };



  const alternarConcluida = async (id) => {
    const originalTasks = [...tasks];
    const updatedTasks = tasks.map(task =>
      task._id === id ? { ...task, concluida: !task.concluida } : task
    );
    setTasks(updatedTasks);

    const taskToUpdate = updatedTasks.find(task => task._id === id);

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: taskToUpdate.concluida ? 'concluida' : 'pendente' }),
      });
    } catch {
      setTasks(originalTasks);
      setErro('Erro ao atualizar tarefa');
    }
  };

  const apagarTask = async (id) => {
    const originalTasks = [...tasks];
    const updatedTasks = tasks.filter(task => task._id !== id);
    setTasks(updatedTasks);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error('Falha ao apagar');
      }
    } catch {
      setTasks(originalTasks);
      setErro('Erro ao apagar tarefa');
    }
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-green-300 shadow-2xl bgbox
       text-green-700 font-medium rounded-xl p-4 max-w-x2 mx-auto space-y-4 mt-6">
      <h2 className="text-[25px] font-bold text-center underline tracking-[5px] underline-offset-12">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        🍃Task List🍃
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </h2>
      {erro && <p className="text-red-500 text-sm">{erro}</p>}
      <div className="flex gap-1">
        <input
          type="text"
          placeholder="New task"
          value={novaTask}
          onChange={(e) => setNovaTask(e.target.value)}
          className="flex-1 p-3 border rounded-lg w-130"
        />
        <input
          type="date"
          value={dataLimite}
          onChange={(e) => setDataLimite(e.target.value)}
          className="p-3 border rounded-lg"
        />
        <input
          type="time"
          value={horaLimite}
          onChange={(e) => setHoraLimite(e.target.value)}
          className="p-3 border rounded-lg"
        />
        <button onClick={criarTask} className="newtaskbutton bg-blue-500 text-white p-2 rounded-xl">
          📝
        </button>
      </div>
      <ul className="text-center">
        {tasks.map((task) => (
          <li key={task._id} className={task.concluida ? 'taskdone h-11 m-2 flex items-center justify-between bg-transparent p-2 border rounded-xl shadow' : 'h-11 m-2 flex items-center justify-between bg-transparent p-2 border rounded-xl shadow'}>
            <div>
              <input
                type="checkbox"
                checked={task.concluida}
                onChange={() => alternarConcluida(task._id)}
                className="mr-2 ml-2 checkbox"
              />
              <span className={task.concluida ? 'text-green-900 line-through p-2' : 'p-2 text-green-800'}>
                {task.nome}
              </span>
              {task.prazo && (
                <small className="ml-2 text-green-600">
                  ({new Date(task.prazo).toLocaleString()})
                </small>
              )}
            </div>
            <button className="binbutton h-9 text-red-500 hover:text-red-700"
              onClick={() => apagarTask(task._id)}>
              🗑️
            </button>
          </li>
        ))}
      </ul>
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
