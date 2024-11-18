// ローカルストレージからTODOを取得
const getTodos = () => JSON.parse(localStorage.getItem('todos')) || [];

// ローカルストレージにTODOを保存
const saveTodos = (todos) => localStorage.setItem('todos', JSON.stringify(todos));

// 初期化
let todos = getTodos();

// DOM要素の取得
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const uncompletedList = document.getElementById('uncompleted-todo-list');
const completedList = document.getElementById('completed-todo-list');

// TODOをDOMに描画
const renderTodos = () => {
  uncompletedList.innerHTML = '';
  completedList.innerHTML = '';

  todos.forEach((todo) => {
    const todoCard = document.createElement('div');
    todoCard.className = `todo-card ${todo.completed ? 'todo-completed' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => toggleTodoCompletion(todo.id));

    const todoText = document.createElement('span');
    todoText.className = 'todo-text';
    todoText.contentEditable = true;
    todoText.textContent = todo.text;
    todoText.addEventListener('input', () => editTodoText(todo.id, todoText.textContent));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '削除';
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

    todoCard.appendChild(checkbox);
    todoCard.appendChild(todoText);
    todoCard.appendChild(deleteBtn);

    if (todo.completed) {
      completedList.appendChild(todoCard);
    } else {
      uncompletedList.appendChild(todoCard);
    }
  });
};

// TODOを追加
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();  // フォームのデフォルトの動作を無効化
  const text = todoInput.value.trim();  // 入力されたテキストを取得

  if (text === '') return;  // 空文字の場合は処理しない

  // 新しいTODOオブジェクトを作成
  const newTodo = { id: Date.now(), text, completed: false };
  
  // TODOリストに追加し、ローカルストレージに保存
  todos.push(newTodo);
  saveTodos(todos);

  todoInput.value = '';  // 入力欄を空にする
  renderTodos();  // TODOリストを再描画
});

// TODOの完了状態を切り替え
const toggleTodoCompletion = (id) => {
  todos = todos.map((todo) => 
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos(todos);
  renderTodos();
};

// TODOのテキストを編集
const editTodoText = (id, newText) => {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, text: newText } : todo
  );
  saveTodos(todos);
};

// TODOを削除
const deleteTodo = (id) => {
  if (confirm('このTODOを削除してもよろしいですか？')) {
    todos = todos.filter((todo) => todo.id !== id);
    saveTodos(todos);
    renderTodos();
  }
};

// 初期描画
renderTodos();
