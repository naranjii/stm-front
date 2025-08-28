import { useState, useEffect } from 'react';
import NewtaskBox from './ui/PanelNewTaskUI';
import TaskContainer from './Container';
import PanelNewTaskUI from './ui/PanelNewTaskUI';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';


export default function Panel() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [novaTask, setNovaTask] = useState('');
  const [dataLimite, setDataLimite] = useState('');
  const [horaLimite, setHoraLimite] = useState('');
  const [erro, setErro] = useState('');
  const [containers, setContainers] = useState([]);
  const [selectedContainerId, setSelectedContainerId] = useState('');

  const token = localStorage.getItem('token');

  const carregarContainers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/containers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setContainers(data);
      if (data.length > 0) {
        setSelectedContainerId(data[0]._id);
      }
    } catch (err) {
      setErro('Erro ao carregar containers');
    }
  };

  const carregarTasks = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setErro('Erro ao carregar tarefas');
    }
  };

  useEffect(() => {
    carregarContainers();
    carregarTasks();
  }, []);

  const criarTask = async () => {
    if (!novaTask) return;
    try {
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
        body: JSON.stringify({ nome: novaTask, prazo, containerId: selectedContainerId }),
      });
      if (!res.ok) throw new Error();
      setNovaTask('');
      setDataLimite('');
      setHoraLimite('');
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
      await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: taskToUpdate.concluida ? 'concluida' : 'pendente' }),
        }
      );
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        throw new Error('Falha ao apagar');
      }
    } catch {
      setTasks(originalTasks);
      setErro('Erro ao apagar tarefa');
    }
  };
  const handleNewContainer = async () => {
    const newContainerName = prompt('Enter new container name:');
    if (newContainerName) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/containers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: newContainerName }),
        });
        if (!res.ok) throw new Error();
        carregarContainers();
      } catch (err) {
        setErro('Erro ao criar container');
      }
    }
  };

  return (
    <div className='w-dvw h-dvh flex flex-col items-center justify-center'>
      <div className="flex flex-col items-center justify-center max-w-[90%]">
        <div id="draggable" className="border-2 border-green-300 containershadow bgbox
       text-green-700 font-medium rounded-xl p-4 space-y-4">
          <h2 className="text-[25px] font-bold text-center underline tracking-[5px] underline-offset-12 select-none">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            🍃starred⭐Task Manager🍃
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </h2>
          {erro && <p className="text-red-500 text-sm">{erro}</p>}
          <PanelNewTaskUI
            novaTask={novaTask}
            setNovaTask={setNovaTask}
            dataLimite={dataLimite}
            setDataLimite={setDataLimite}
            horaLimite={horaLimite}
            setHoraLimite={setHoraLimite}
            criarTask={criarTask}
            containers={containers}
            selectedContainerId={selectedContainerId}
            setSelectedContainerId={setSelectedContainerId}
            handleNewContainer={handleNewContainer}
          />
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
        <div className="w-full gap-2 flex items-top justify-center">{containers.map((container) => (
          <TaskContainer
            tasks={tasks.filter(task => task.containerId === container._id)}
            key={container._id}
            container={container}
            alternarConcluida={alternarConcluida}
            apagarTask={apagarTask}
          />
        ))}</div  ></div>
    </div>
  );
}
