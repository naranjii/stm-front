
export default function TaskContainer({ tasks, alternarConcluida, apagarTask }) {
    return (
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
    )
}
