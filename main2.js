document.addEventListener('DOMContentLoaded', function () {
    const taskList = document.getElementById('task-list');
    const addTaskButton = document.getElementById('add-task');
    const newTaskInput = document.getElementById('new-task');
    const dueDateInput = document.getElementById('due-date');
    const searchInput = document.getElementById('search');

    // Załaduj zadania z Local Storage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];


    // wyświetlanie listy zadań
    function renderTasks(filter = '') {
        taskList.innerHTML = '';

        tasks.forEach((task, index) => {
            if (filter && !task.name.includes(filter)) return;

            const li = document.createElement('li');

            // Create the checkbox and add it as the first child
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            li.appendChild(checkbox);

            // Format the date to display only the date part, e.g., "dd.mm.yyyy"
            const formattedDate = task.date ? new Date(task.date).toLocaleDateString('pl-PL') : 'Brak terminu';

            li.innerHTML += `
            <span class="task-name">${highlightSearch(task.name, filter)}</span> - 
            <span class="task-date">${formattedDate}</span>
            <button class="delete-task">🗑️</button>
        `;

            li.querySelector('.task-name').addEventListener('click', () => editTask(index, li));
            li.querySelector('.delete-task').addEventListener('click', () => deleteTask(index));

            taskList.appendChild(li);
        });
    }


    // dodawanie nowego zadania
    addTaskButton.addEventListener('click', function () {
        const taskName = newTaskInput.value.trim();
        const dueDate = dueDateInput.value;

        if (taskName.length < 3 || taskName.length > 255) {
            alert('Zadanie musi mieć co najmniej 3 znaki i nie więcej niż 255 znaków.');
            return;
        }

        if (dueDate && new Date(dueDate) < new Date()) {
            alert('Data musi być pusta lub w przyszłości.');
            return;
        }

        tasks.push({ name: taskName, date: dueDate });
        saveTasks();
        renderTasks();
        newTaskInput.value = '';
        dueDateInput.value = '';
    });

    // Funkcja edycji zadania
    function editTask(index, listItem) {
        const task = tasks[index];

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.value = task.name;
        listItem.querySelector('.task-name').replaceWith(nameInput);

        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.value = task.date ? new Date(task.date).toISOString().split('T')[0] : '';
        listItem.querySelector('.task-date').replaceWith(dateInput);
        
        const saveChanges = () => {
            const updatedName = nameInput.value.trim();
            const updatedDate = dateInput.value;

            if (updatedName.length < 3 || updatedName.length > 255) {
                alert('Zadanie musi mieć co najmniej 3 znaki i nie więcej niż 255 znaków.');
                return;
            }

            if (updatedDate && new Date(updatedDate) < new Date()) {
                alert('Data musi być pusta lub w przyszłości.');
                return;
            }

            // Save the changes
            tasks[index].name = updatedName;
            tasks[index].date = updatedDate;
            saveTasks();
            renderTasks();
        };

        let blurTimeout;

        nameInput.addEventListener('blur', () => {
            blurTimeout = setTimeout(saveChanges, 200);
        });
        dateInput.addEventListener('blur', () => {
            blurTimeout = setTimeout(saveChanges, 200);
        });
        nameInput.addEventListener('focus', () => clearTimeout(blurTimeout));
        dateInput.addEventListener('focus', () => clearTimeout(blurTimeout));

        nameInput.focus();
    }



    // Funkcja usuwania zadania
    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }

    // Zapis do Local Storage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // wyróżnianie tekstu
    function highlightSearch(text, search) {
        if (!search) return text;
        const regex = new RegExp(`(${search})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    // wyszukiwanie
    searchInput.addEventListener('input', function () {
        const searchQuery = searchInput.value.trim();
        if (searchQuery.length >= 2) {
            renderTasks(searchQuery);
        } else {
            renderTasks();
        }
    });

    renderTasks();
});
