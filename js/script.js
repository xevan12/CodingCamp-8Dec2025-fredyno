(function(){
  // New JavaScript implementation with console logging.
  const FORM_ID = 'todo-form';
  const LIST_KEY = 'todo.tasks';

  console.log('[TODO] script loaded');

  const form = document.getElementById(FORM_ID);
  if (!form) { console.log('[TODO] form not found, aborting'); return; }

  const inputName = document.getElementById('todo-input');
  const inputActivity = document.getElementById('todo-input2');
  const inputDate = document.getElementById('todo-input3');
  const deleteBtn = document.getElementById('delete-button');
  const listEl = document.getElementById('todo-list');
  const emptyMessage = document.getElementById('empty-message');

  let tasks = loadTasks();
  console.log('[TODO] loaded', tasks.length, 'tasks');
  render();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (inputName && inputName.value || '').trim();
    const activity = (inputActivity && inputActivity.value || '').trim();
    const date = (inputDate && inputDate.value) || '';
    const genderEl = form.querySelector('input[name="Gender"]:checked');
    const gender = genderEl ? genderEl.value : '';

    if (!activity) {
      console.log('[TODO] submit ignored — activity empty');
      inputActivity && inputActivity.focus();
      return;
    }

    const task = { id: Date.now().toString(), name, activity, date, gender, done: false };
    tasks.push(task);
    saveTasks();
    console.log('[TODO] added task', task.id, task.activity);
    render();

    if (inputActivity) inputActivity.value = '';
    if (inputDate) inputDate.value = '';
    inputActivity && inputActivity.focus();
  });

  if (deleteBtn) deleteBtn.addEventListener('click', () => {
    console.log('[TODO] clearing form fields');
    if (inputActivity) inputActivity.value = '';
    if (inputDate) inputDate.value = '';
    if (inputName) inputName.value = '';
  });

  if (listEl) listEl.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    const id = li.dataset.id;
    if (!id) return;

    if (e.target.matches('.item-delete')) {
      console.log('[TODO] delete clicked', id);
      tasks = tasks.filter(t => t.id !== id);
      saveTasks();
      render();
      return;
    }

    if (e.target.matches('.item-toggle')) {
      console.log('[TODO] toggle clicked', id);
      tasks = tasks.map(t => t.id === id ? Object.assign({}, t, {done: !t.done}) : t);
      saveTasks();
      render();
      return;
    }
  });

  function render(){
    if (!listEl) return;
    listEl.innerHTML = '';
    if (!tasks || tasks.length === 0){
      if (emptyMessage) emptyMessage.style.display = 'block';
      console.log('[TODO] no tasks to render');
      return;
    }
    if (emptyMessage) emptyMessage.style.display = 'none';

    tasks.forEach(t => {
      const li = document.createElement('li');
      li.dataset.id = t.id;
      li.style.display = 'contents';

      // Helper to create a table cell
      const createCell = (content) => {
        const cell = document.createElement('div');
        cell.className = 'table-cell';
        if (t.done) cell.classList.add('completed');
        cell.textContent = content || '';
        return cell;
      };

      li.appendChild(createCell(t.name));
      li.appendChild(createCell(t.activity));
      li.appendChild(createCell(t.date));
      li.appendChild(createCell(t.gender));

      // Action cell
      const actionCell = document.createElement('div');
      actionCell.className = 'table-cell';
      actionCell.style.borderRight = 'none';

      const toggleBtn = document.createElement('button');
      toggleBtn.type = 'button';
      toggleBtn.className = 'item-toggle action-btn';
      toggleBtn.textContent = t.done ? 'Undo' : 'Done';

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'item-delete action-btn delete';
      delBtn.textContent = 'Delete';

      actionCell.appendChild(toggleBtn);
      actionCell.appendChild(delBtn);
      li.appendChild(actionCell);

      listEl.appendChild(li);
    });
    console.log('[TODO] render complete —', tasks.length, 'items');
  }

  function saveTasks(){
    try{ localStorage.setItem(LIST_KEY, JSON.stringify(tasks)); console.log('[TODO] saved', tasks.length, 'tasks'); }catch(e){ console.error('[TODO] saveTasks failed', e); }
  }

  function loadTasks(){
    try{
      const raw = localStorage.getItem(LIST_KEY);
      const loaded = raw ? JSON.parse(raw) : [];
      return loaded;
    }catch(e){ console.error('[TODO] loadTasks failed', e); return []; }
  }

})();