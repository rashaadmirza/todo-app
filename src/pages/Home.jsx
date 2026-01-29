// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { FaSave, FaTimes, FaTrash } from "react-icons/fa";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function Home({ user }) {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const todosRef = collection(db, "todos");

  // Fetch todos for this user
  useEffect(() => {
    const fetchTodos = async () => {
      const q = query(todosRef, where("uid", "==", user.uid));
      const snapshot = await getDocs(q);
      setTodos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchTodos();
  }, [user.uid]);

  // Add new todo
  const handleAdd = async () => {
    if (!todo.trim()) return;
    const newTodo = { uid: user.uid, todo, isCompleted: false };
    const docRef = await addDoc(todosRef, newTodo);
    setTodos(prev => [...prev, { id: docRef.id, ...newTodo }]);
    setTodo("");
  };

  // Toggle complete/incomplete
  const handleToggle = async (id) => {
    if (editingId !== null) return;
    const todoItem = todos.find(t => t.id === id);
    if (!todoItem) return;
    const updated = { ...todoItem, isCompleted: !todoItem.isCompleted };
    await updateDoc(doc(db, "todos", id), { isCompleted: updated.isCompleted });
    setTodos(prev => prev.map(t => (t.id === id ? updated : t)));
  };

  // Start edit mode
  const handleStartEdit = (id) => {
    const todoItem = todos.find(t => t.id === id);
    if (!todoItem) return;

    // mark completed item as incomplete
    if (todoItem.isCompleted) handleToggle(id);

    setEditingId(id);
    setEditingText(todoItem.todo);
  };

  // Save edit
  const handleSaveEdit = async (id) => {
    if (!editingText.trim()) return;
    await updateDoc(doc(db, "todos", id), { todo: editingText });
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, todo: editingText } : t)));
    setEditingId(null);
    setEditingText("");
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  // Delete todo
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "todos", id));
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  // Cancel edit if click outside
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
        <h2 className="text-xl font-bold mb-2">Add a new todo</h2>
        <form
          className="add-todo flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
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
        <h2 className="text-xl font-bold mb-2">Your Todos</h2>
        {todos.length === 0 && <p>All clear! Add a task to get started.</p>}

        <div className="todo-list space-y-2">
          {todos.map(item => (
            <button
              key={item.id}
              type="button"
              className={`todo-item flex justify-between items-center p-3 rounded-md
    ${item.isCompleted ? "line-through text-gray-500 bg-gray-100" : "bg-white hover:bg-gray-50"}
    focus:outline-none focus:ring-2 focus:ring-violet-400`}
              onClick={() => {
                if (editingId === item.id) return;
                handleToggle(item.id);
              }}
              onDoubleClick={() => handleStartEdit(item.id)}
              onKeyDown={(e) => {
                if (editingId === item.id) return;
                if (e.key === "F2") handleStartEdit(item.id);
              }}
            >
              {/* Todo Text / Edit Mode */}
              <div className="flex-1 text-left">
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
                        onClick={e => { e.stopPropagation(); handleSaveEdit(item.id); }}
                        className="button bg-green-600 hover:bg-green-800 px-2 py-1 text-sm flex items-center gap-1"
                      >
                        <FaSave /> Save
                      </button>
                      <button
                        id={`cancel-btn-${item.id}`}
                        onClick={e => { e.stopPropagation(); handleCancelEdit(); }}
                        className="button bg-gray-500 hover:bg-gray-800 px-2 py-1 text-sm flex items-center gap-1"
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
                  onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                >
                  <FaTrash className="text-gray-300 hover:text-red-700" />
                </button>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}