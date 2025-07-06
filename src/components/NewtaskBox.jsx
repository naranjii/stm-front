export default function NewtaskBox({
  novaTask,
  setNovaTask,
  dataLimite,
  setDataLimite,
  horaLimite,
  setHoraLimite,
  criarTask,
}) {
  return (
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
      <button
        onClick={criarTask}
        className="newtaskbutton bg-blue-500 text-white p-2 rounded-xl"
      >
        📝
      </button>
    </div>
  );
}