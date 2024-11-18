const getTodos = () => {
  const todos = localStorage.getItem('todos');
  return todos ? JSON.parse(todos) : { uncompleted: [], completed: [] };
};

const saveTodos = (todos) => {
  localStorage.setItem('todos', JSON.stringify(todos));
};

const renderTodos = () => {
  const { uncompleted, completed } = getTodos();

  // 未完了TODO描画
  const uncompletedList = document.getElementById('uncompleted-todo-list');
  uncompletedList.innerHTML = '';
  uncompleted.forEach(todo => {
    const todoCard = createTodoCard(todo, false);
    uncompletedList.appendChild(todoCard);
  });

  // 完了済みTODO描画
  const completedList = document.getElementById('completed-todo-list');
  completedList.innerHTML = '';
  completed.forEach(todo => {
    const todoCard = createTodoCard(todo, true);
    completedList.appendChild(todoCard);
  });
};

const createTodoCard = (todo, isCompleted) => {
  const todoCard = document.createElement('div');
  todoCard.classList.add('todo-card');
  if (isCompleted) todoCard.classList.add('todo-completed');

  todoCard.innerHTML = `
    <input type="checkbox" ${isCompleted ? 'checked' : ''}>
    <span class="todo-text" data-id="${todo.id}">${todo.text}</span>
    <button class="delete-btn">削除</button>
  `;

  // チェックボックスのイベント
  const checkbox = todoCard.querySelector('input[type="checkbox"]');
  checkbox.addEventListener('change', () => toggleTodoCompletion(todo.id, isCompleted));

  // 削除ボタンのイベント
  const deleteBtn = todoCard.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', () => {
    if (confirm('このTODOを削除してもよろしいですか？')) {
      deleteTodo(todo.id, isCompleted);
    }
  });

  return todoCard;
};

const addTodo = (text) => {
  const todos = getTodos();
  const newTodo = { id: crypto.randomUUID(), text };
  todos.uncompleted.push(newTodo);
  saveTodos(todos);
  renderTodos();
};

const toggleTodoCompletion = (id, isCompleted) => {
  const todos = getTodos();
  if (isCompleted) {
    const todoIndex = todos.completed.findIndex(todo => todo.id === id);
    const [todo] = todos.completed.splice(todoIndex, 1);
    todos.uncompleted.push(todo);
  } else {
    const todoIndex = todos.uncompleted.findIndex(todo => todo.id === id);
    const [todo] = todos.uncompleted.splice(todoIndex, 1);
    todos.completed.push(todo);
  }
  saveTodos(todos);
  renderTodos();
};

const deleteTodo = (id, isCompleted) => {
  const todos = getTodos();
  if (isCompleted) {
    todos.completed = todos.completed.filter(todo => todo.id !== id);
  } else {
    todos.uncompleted = todos.uncompleted.filter(todo => todo.id !== id);
  }
  saveTodos(todos);
  renderTodos();
};

// フォーム送信イベント
document.getElementById('todo-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('todo-input');
  const text = input.value.trim();
  if (text) {
    addTodo(text);
    input.value = '';
  }
});

// 初期描画
renderTodos();
