document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const searchInput = document.getElementById('search');
    const addTaskBtn = document.getElementById('add-task-btn');
    const newTaskInput = document.getElementById('new-task-input');
    const dueDateInput = document.getElementById('due-date');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    renderTasks(tasks);

    addTaskBtn.addEventListener('click', () => {
        const taskText = newTaskInput.value.trim();
        const dueDate = dueDateInput.value;

        if (taskText.length < 3 || taskText.length > 255) {
            alert("Zadanie musi zawierać co najmniej 3 znaki i maksymalnie 255 znaków.");
            return;
        }

        if (dueDate && new Date(dueDate) <= new Date()) {
            alert("Data musi być pusta lub w przyszłości.");
            return;
        }

        const task = {
            text: taskText,
            dueDate: dueDate,
            completed: false
        };
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks(tasks);
        newTaskInput.value = '';
        dueDateInput.value = '';
    });

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm.length >= 2) {
            const filteredTasks = tasks.filter(task => task.text.toLowerCase().includes(searchTerm));
            renderTasks(filteredTasks, searchTerm);
        } else {
            renderTasks(tasks);
        }
    });

    function renderTasks(tasksToRender, highlight = '') {
        taskList.innerHTML = '';
        tasksToRender.forEach((task, index) => {
            const li = document.createElement('li');
            const taskContent = highlight ? task.text.replace(new RegExp(highlight, 'gi'), match => `<mark>${match}</mark>`) : task.text;
            li.innerHTML = `
                <span>${taskContent}</span> <span>${task.dueDate || ''}</span>
                <button class="delete-btn" data-index="${index}">🗑</button>
            `;
            li.addEventListener('click', () => editTask(index));
            taskList.appendChild(li);
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = btn.getAttribute('data-index');
                tasks.splice(index, 1);
                localStorage.setItem('tasks', JSON.stringify(tasks));
                renderTasks(tasks);
            });
        });
    }

    function editTask(index) {
        const taskElement = taskList.children[index];
        const task = tasks[index];

        const textInput = document.createElement('input');
        textInput.value = task.text;
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.value = task.dueDate || '';

        const textSpan = taskElement.querySelector('span:first-child');
        const dateSpan = taskElement.querySelector('span:nth-child(2)');
        taskElement.replaceChild(textInput, textSpan);
        taskElement.replaceChild(dateInput, dateSpan);

        function saveChanges() {
            task.text = textInput.value;
            task.dueDate = dateInput.value || '';
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks(tasks);
        }

        textInput.addEventListener('blur', saveChanges);
        dateInput.addEventListener('blur', saveChanges);
    }
});
