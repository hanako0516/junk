"use client";
import React from "react";

function MainComponent() {
  const [todos, setTodos] = React.useState([]);
  const [isDragging, setIsDragging] = React.useState(null);
  const addTodo = () => {
    const newTodo = {
      id: Date.now(),
      title: "",
      completed: false,
      deadline: "",
      startX: 0,
      currentX: 0,
    };
    setTodos([...todos, newTodo]);
  };
  const copyShareUrl = () => {
    navigator.clipboard.writeText(window.location.href);
  };
  const handleDragStart = (e, index) => {
    setIsDragging(index);
  };
  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (isDragging === null) return;

    const newTodos = [...todos];
    const draggedTodo = newTodos[isDragging];
    newTodos.splice(isDragging, 1);
    newTodos.splice(index, 0, draggedTodo);
    setTodos(newTodos);
    setIsDragging(index);
  };
  const handleTouchStart = (e, id) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      todo.startX = e.touches[0].clientX;
      todo.currentX = e.touches[0].clientX;
    }
  };
  const handleTouchMove = (e, id) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      todo.currentX = e.touches[0].clientX;
      const deltaX = todo.currentX - todo.startX;
      const element = e.currentTarget;
      element.style.transform = `translateX(${deltaX}px)`;
    }
  };
  const handleTouchEnd = (e, id) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      const deltaX = todo.currentX - todo.startX;
      if (Math.abs(deltaX) > 100) {
        setTodos(todos.filter((t) => t.id !== id));
      } else {
        e.currentTarget.style.transform = "translateX(0)";
      }
    }
  };
  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };
  const getBackgroundColor = (todo) => {
    if (todo.completed) return "bg-[#e6fffa]";
    if (!todo.deadline) return "bg-[#ffffff]";

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(todo.deadline);
    deadlineDate.setHours(0, 0, 0, 0);

    if (deadlineDate < today) return "bg-[#ffe6e6]";
    if (deadlineDate.getTime() === today.getTime()) return "bg-[#fffde7]";
    return "bg-[#ffffff]";
  };

  return (
    <div className="min-h-screen bg-[#f0f8ff] p-4 relative">
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-[#2196f3] to-[#00bcd4] p-6 shadow-lg z-40">
        <h1 className="text-4xl font-bold text-white text-center font-roboto tracking-wider">
          My Todo List
          <span className="ml-2 animate-bounce inline-block">✨</span>
        </h1>
      </div>
      <div className="fixed top-20 right-4 flex gap-4 z-50">
        <button
          onClick={addTodo}
          className="bg-[#00bcd4] text-white font-bold p-4 rounded-full text-2xl hover:bg-[#00acc1] transition-colors shadow-lg"
        >
          <i className="fas fa-plus"></i>
        </button>
        <button
          onClick={copyShareUrl}
          className="bg-[#00bcd4] text-white font-bold p-4 rounded-full text-2xl hover:bg-[#00acc1] transition-colors shadow-lg"
        >
          <i className="fas fa-share-alt"></i>
        </button>
      </div>
      <div className="max-w-3xl mx-auto pt-28">
        <div className="bg-white rounded-xl shadow-lg p-4 overflow-x-hidden">
          {todos.map((todo, index) => (
            <div
              key={todo.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={() => setIsDragging(null)}
              onTouchStart={(e) => handleTouchStart(e, todo.id)}
              onTouchMove={(e) => handleTouchMove(e, todo.id)}
              onTouchEnd={(e) => handleTouchEnd(e, todo.id)}
              className={`flex flex-col sm:flex-row items-start sm:items-center p-4 mb-3 rounded-lg transition-all gap-4 border border-[#e3f2fd] ${getBackgroundColor(
                todo
              )}`}
            >
              <div className="flex items-center w-full gap-4 min-w-0">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => {
                    const newTodos = [...todos];
                    const todoIndex = newTodos.findIndex(
                      (t) => t.id === todo.id
                    );
                    newTodos[todoIndex].completed =
                      !newTodos[todoIndex].completed;
                    setTodos(newTodos);
                  }}
                  className="w-6 h-6 cursor-pointer flex-shrink-0"
                />
                <input
                  type="text"
                  value={todo.title}
                  onChange={(e) => {
                    const newTodos = [...todos];
                    const todoIndex = newTodos.findIndex(
                      (t) => t.id === todo.id
                    );
                    newTodos[todoIndex].title = e.target.value;
                    setTodos(newTodos);
                  }}
                  placeholder="TODOを入力"
                  className={`flex-1 text-lg sm:text-xl p-2 border-b-2 border-[#e2e8f0] focus:outline-none focus:border-[#00bcd4] min-w-0 ${
                    todo.completed ? "line-through text-[#9ca3af]" : ""
                  }`}
                />
              </div>
              <div className="flex items-center w-full sm:w-auto gap-4">
                <input
                  type="date"
                  value={todo.deadline}
                  onChange={(e) => {
                    const newTodos = [...todos];
                    const todoIndex = newTodos.findIndex(
                      (t) => t.id === todo.id
                    );
                    newTodos[todoIndex].deadline = e.target.value;
                    setTodos(newTodos);
                  }}
                  className="flex-1 text-base sm:text-lg p-2 rounded border-2 border-[#e2e8f0] focus:outline-none focus:border-[#4a90e2]"
                />
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-[#ef4444] hover:text-[#dc2626] transition-colors p-2 self-end sm:self-auto"
                >
                  <i className="fas fa-trash-alt text-xl"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        .todo-item {
          transition: transform 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default MainComponent;