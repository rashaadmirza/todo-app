import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FaSave, FaTimes, FaTrash } from 'react-icons/fa';

function Home() {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // Load todos from localStorage
  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) setTodos(JSON.parse(storedTodos));
  }, []);

  const updateTodos = (updater) => {
    setTodos(prev => {
      const updated = updater(prev);
      localStorage.setItem("todos", JSON.stringify(updated));
      return updated;
    });
  };

  // Add new to-do
  const handleAdd = () => {
    if (!todo.trim()) return;
    const newTodo = { id: uuidv4(), todo, isCompleted: false };
    updateTodos(prev => [...prev, newTodo]);
    setTodo("");
  };

  // Toggle complete/incomplete
  const handleToggle = (id) => {
    if (editingId !== null) return; // disable toggling while editing
    updateTodos(prev => prev.map(t =>
      t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
    ));
  };

  // Start edit mode (double-click)
  const handleStartEdit = (id) => {
    // Mark completed item as incomplete first
    updateTodos(prev => prev.map(t =>
      t.id === id && t.isCompleted ? { ...t, isCompleted: false } : t
    ));
    const todoToEdit = todos.find(t => t.id === id);
    if (!todoToEdit) return;
    setEditingId(id);
    setEditingText(todoToEdit.todo);
  };

  // Save edit
  const handleSaveEdit = (id) => {
    if (!editingText.trim()) return;
    updateTodos(prev => prev.map(t =>
      t.id === id ? { ...t, todo: editingText } : t
    ));
    setEditingId(null);
    setEditingText("");
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  // Delete to-do
  const handleDelete = (id) => {
    updateTodos(prev => prev.filter(t => t.id !== id));
  };

  // Cancel edit if click outside input or buttons
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (editingId !== null) {
        const input = document.getElementById(`edit-input-${editingId}`);
        const saveBtn = document.getElementById(`save-btn-${editingId}`);
        const cancelBtn = document.getElementById(`cancel-btn-${editingId}`);
        if (
          input && !input.contains(e.target) &&
          saveBtn && !saveBtn.contains(e.target) &&
          cancelBtn && !cancelBtn.contains(e.target)
        ) {
          handleCancelEdit();
        }
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [editingId]);

  return (
    <div className="home-page flex flex-col gap-8">
      <div className="container workspace">
        {/* Add To-do */}
        <h2 className="text-xl font-bold mb-2">Add a new todo</h2>
        <form
          className="add-todo flex gap-2"
          onSubmit={(e) => {
            e.preventDefault(); // prevent page refresh
            handleAdd();
          }}
        >
          <input
            type="text"
            placeholder="Type something and press Enter…"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            className="input-field flex-1"
          />
        </form>
      </div>

      <div className="container workspace">
        {/* To-do List */}
        <h2 className="text-xl font-bold mb-2">Your Todos</h2>
        {todos.length === 0 && <p>All clear! Add a task to get started.</p>}

        <div className="todo-list space-y-2">
          {todos.map(item => (
            <div
              key={item.id}
              role="group"
              tabIndex={editingId === item.id ? -1 : 0}
              aria-label={`Todo item: ${item.todo}`}
              className={`todo-item flex justify-between items-center p-3 rounded-md
    ${item.isCompleted ? "line-through text-gray-500 bg-gray-100" : "bg-white hover:bg-gray-50"}
    focus:outline-none focus:ring-2 focus:ring-violet-400`}

              onClick={() => {
                if (editingId === item.id) return
                handleToggle(item.id)
              }}

              onDoubleClick={() => handleStartEdit(item.id)}

              onKeyDown={(e) => {
                if (editingId === item.id) return

                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  handleToggle(item.id)
                }

                if (e.key === "F2") {
                  handleStartEdit(item.id)
                }
              }}
            >

              {/* To-do Text / Edit Mode */}
              <div className="flex-1">
                {editingId === item.id ? (
                  <div className="flex flex-col sm:flex-row gap-2 justify-between items-center">
                    <input
                      id={`edit-input-${item.id}`}
                      type="text"
                      className="input-field flex-1 px-2 py-1 border rounded outline-none min-w-full sm:min-w-fit"
                      value={editingText}
                      onChange={e => setEditingText(e.target.value)}
                      onClick={e => e.stopPropagation()}
                    />
                    <div className="buttons flex gap-2 mt-2 sm:mt-0">
                      <button
                        id={`save-btn-${item.id}`}
                        onClick={e => { e.stopPropagation(); handleSaveEdit(item.id) }}
                        className="button bg-green-600 hover:bg-green-800"
                      >
                        <FaSave /> Save
                      </button>
                      <button
                        id={`cancel-btn-${item.id}`}
                        onClick={e => { e.stopPropagation(); handleCancelEdit() }}
                        className="button bg-gray-500 hover:bg-gray-800 "
                      >
                        <FaTimes /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  item.todo
                )}
              </div>

              {/* Delete icon */}
              {editingId !== item.id && (
                <button
                  type="button"
                  aria-label="Delete todo"
                  className="delete-icon sm:opacity-0 sm:hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(item.id)
                  }}
                >
                  <FaTrash className="text-gray-300 hover:text-red-700" />
                </button>
              )}

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
