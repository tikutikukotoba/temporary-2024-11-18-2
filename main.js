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

  // 改行対応で改行文字をHTMLの<br>に変換
  const formattedText = todo.text.replace(/\n/g, '<br>');

  todoCard.innerHTML = `
    <input type="checkbox" ${isCompleted ? 'checked' : ''}>
    <span class="todo-text" data-id="${todo.id}" contenteditable="true">${formattedText}</span>
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

  // テキスト編集（blurイベントで保存）
  const todoText = todoCard.querySelector('.todo-text');
  todoText.addEventListener('blur', () => updateTodoText(todo.id, isCompleted, todoText));

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

// TODOテキストの更新
const updateTodoText = (id, isCompleted, textNode) => {
  const newText = textNode.innerText.trim();
  const todos = getTodos();
  const targetList = isCompleted ? todos.completed : todos.uncompleted;
  const todo = targetList.find(todo => todo.id === id);

  if (todo) {
    todo.text = newText;
    saveTodos(todos);
  }
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
