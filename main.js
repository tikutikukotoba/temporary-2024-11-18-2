document.getElementById('todo-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const todoInput = document.getElementById('todo-input');
  const todoText = todoInput.value.trim();
  if (todoText !== "") {
    const todos = getTodos();
    todos.push({ id: crypto.randomUUID(), text: todoText, completed: false });
    localStorage.setItem('todos', JSON.stringify(todos));
    todoInput.value = '';
    displayTodos();
  }
});

const getTodos = () => {
  const storedTodos = localStorage.getItem('todos');
  return storedTodos ? JSON.parse(storedTodos) : [];
};

const displayTodos = () => {
  const todos = getTodos();
  const uncompletedTodoList = document.getElementById('uncompleted-todo-list');
  const completedTodoList = document.getElementById('completed-todo-list');
  uncompletedTodoList.innerHTML = '';
  completedTodoList.innerHTML = '';
  todos.filter(todo => !todo.completed).forEach(todo => appendTodoCard(todo, uncompletedTodoList));
  todos.filter(todo => todo.completed).forEach(todo => appendTodoCard(todo, completedTodoList));
};

const appendTodoCard = (todo, todoList) => {
  const todoCard = document.createElement('div');
  todoCard.className = 'todo-card';
  if (todo.completed) {
    todoCard.classList.add('todo-completed');
  }

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = todo.completed;
  checkbox.addEventListener('change', _ => toggleTodo(todo.id));

  const todoText = document.createElement('span');
  todoText.className = 'todo-text';
  const textSegments = todo.text.split('\n');
  textSegments.forEach((segment, index) => {
    if (index > 0) todoText.append(document.createElement('br'));
    todoText.append(segment);
  });
  todoText.dataset.id = todo.id;
  todoText.contentEditable = true;
  todoText.addEventListener('input', (e) => {
    const clone = e.target.cloneNode(true);
    [...clone.childNodes].filter(node => node?.tagName === 'BR')
      .forEach(node => clone.replaceChild(document.createTextNode('\n'), node));
    const todos = getTodos();
    const todo = todos.find(todo => todo.id === e.target.dataset.id);
    todo.text = clone.textContent.trim();
    localStorage.setItem('todos', JSON.stringify(todos));
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = '削除';
  deleteBtn.onclick = (event) => {
    event.stopPropagation();
    confirmDelete(todo.id);
  };

  todoCard.appendChild(checkbox);
  todoCard.appendChild(todoText);
  todoCard.appendChild(deleteBtn);
  todoList.appendChild(todoCard);
};

const toggleTodo = (id) => {
  const todos = getTodos();
  const updatedTodos = todos.map(todo => ({ ...todo, completed: todo.id === id ? !todo.completed : todo.completed }));
  localStorage.setItem('todos', JSON.stringify(updatedTodos));
  displayTodos();
};

const confirmDelete = (id) => {
  if (confirm('このTODOを削除してもよろしいですか？')) {
    deleteTodo(id);
  }
};

const deleteTodo = (id) => {
  const todos = getTodos();
  const filteredTodos = todos.filter(todo => todo.id !== id);
  localStorage.setItem('todos', JSON.stringify(filteredTodos));
  displayTodos();
};

window.addEventListener('DOMContentLoaded', (event) => {
  displayTodos();
});

