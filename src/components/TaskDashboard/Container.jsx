export default function TaskContainer({ container, tasks, alternarConcluida, apagarTask }) {
    return (
        <div className="border-2 border-green-300 containershadow bgbox text-green-700 font-medium rounded-xl p-4 max-w-x2 mx-auto space-y-4 mt-6">
            <h3 className="text-xl font-bold text-center mb-4">{container.name}</h3>
            <ul className="text-center">
                {tasks.map(task => (
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
                        <div className="flex items-center">
                            <button className="binbutton h-9 text-gray-500 hover:text-gray-700 mr-2">
                                ...
                            </button>
                            <button className="binbutton h-9 text-red-500 hover:text-red-700"
                                onClick={() => apagarTask(task._id)}>
                                🗑️
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}