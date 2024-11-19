const apiBase = 'http://localhost:3000';

document.getElementById('todo-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('todo-input');
    const title = input.value.trim();

    if (title) {
        const response = await fetch(`${apiBase}/todos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });

        if (response.ok) {
            loadTodos();
            input.value = '';
        }
    }
});

async function loadTodos() {
    const response = await fetch(`${apiBase}/todos`);
    const todos = await response.json();

    const list = document.getElementById('todo-list');
    list.innerHTML = '';

    todos.forEach(todo => {
        const li = document.createElement('li');

        // Task title
        const title = document.createElement('span');
        title.textContent = todo.title;
        title.style.flexGrow = '1';

        // Update Button
        const updateBtn = document.createElement('button');
        updateBtn.textContent = 'Update';
        updateBtn.addEventListener('click', () => showUpdateForm(todo));

        // Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

        // Append elements to list item
        li.style.display = 'flex';
        li.style.gap = '10px';
        li.appendChild(title);
        li.appendChild(updateBtn);
        li.appendChild(deleteBtn);

        list.appendChild(li);
    });
}

function showUpdateForm(todo) {
    const modal = document.getElementById('update-modal');
    const input = document.getElementById('update-input');
    const updateForm = document.getElementById('update-form');

    // Populate the input with the current task title
    input.value = todo.title;

    // Show modal
    modal.style.display = 'block';

    // Add an event listener to handle the form submission
    updateForm.onsubmit = async (e) => {
        e.preventDefault();
        const updatedTitle = input.value.trim();
        if (updatedTitle) {
            await updateTodo(todo.id, updatedTitle);
            modal.style.display = 'none';
        }
    };

    // Add a cancel button handler
    document.getElementById('cancel-update').addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

async function updateTodo(id, title) {
    const response = await fetch(`${apiBase}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
    });

    if (response.ok) {
        loadTodos(); // Reload the tasks
    } else {
        console.error('Failed to update the task');
    }
}


async function deleteTodo(id) {
    const response = await fetch(`${apiBase}/todos/${id}`, {
        method: 'DELETE'
    });

    if (response.ok) loadTodos();
}

loadTodos();
