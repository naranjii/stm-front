import { useState, useEffect } from 'react';
import NewtaskBox from './ui/PanelNewTaskUI';
import TaskContainer from './Container';
import PanelNewTaskUI from './ui/PanelNewTaskUI';

export default function Panel() {
  const [tasks, setTasks] = useState([]);
  const [novaTask, setNovaTask] = useState('');
  const [dataLimite, setDataLimite] = useState('');
  const [horaLimite, setHoraLimite] = useState('');
  const [erro, setErro] = useState('');
  const [container, setContainer] = useState(['Main']);
  const [selectedContainer, setSelectedContainer] = useState('Main');

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
        body: JSON.stringify({ nome: novaTask, prazo, container: selectedContainer }),
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
  const containerArray = [...container];
  const handleNewContainer = () => {
    containerArray.forEach(TaskContainer => container);
    const newContainerName = prompt('Enter new container name:');
    if (newContainerName) {
      setContainer([...container, newContainerName]);
      setSelectedContainer(newContainerName);
    }
  };

  return (
    <div className="space-y-4">
        <h2 className="text-[25px] font-bold text-center underline tracking-[5px] underline-offset-12 select-none">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            🍃Task List🍃
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
            container={container}
            setContainer={setContainer}
            selectedContainer={selectedContainer}
            setSelectedContainer={setSelectedContainer}
            handleNewContainer={handleNewContainer}
        />
    </div>
  );
}
