$(document).ready(function() {
    const taskForm = $('#taskForm');
    const modal = new bootstrap.Modal($('#formModal'), { keyboard: false });

    function saveTask(task) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            addTaskToBoard(task);
        });
    }

    function addTaskToBoard(task) {
        const taskHtml = `
            <div class="task" data-id="${task.id}" data-status="${task.status}">
                <h5>${task.title}</h5>
                <p>${task.description}</p>
                <p><small>Due: ${task.deadline}</small></p>
                <button class="btn btn-danger btn-sm delete-task">Delete</button>
            </div>
        `;
        $(`#${task.status}-cards`).append(taskHtml);
        checkTaskStatus(task);
    }

    function checkTaskStatus(task) {
        const today = dayjs();
        const deadline = dayjs(task.deadline);
        const taskElement = $(`[data-id="${task.id}"]`);

        if (deadline.isBefore(today, 'day')) {
            taskElement.addClass('overdue');
        } else if (deadline.diff(today, 'day') <= 3) {
            taskElement.addClass('nearing-deadline');
        }
    }

    function updateTaskStatus(taskId, newStatus) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.map(task => {
            if (task.id === taskId) {
                task.status = newStatus;
            }
            return task;
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    taskForm.on('submit', function(e) {
        e.preventDefault();
        const title = $('#taskTitle').val();
        const description = $('#taskDescription').val();
        const deadline = $('#taskDeadline').val();

        const task = {
            id: Date.now().toString(),
            title,
            description,
            deadline,
            status: 'to-do'
        };

        saveTask(task);
        addTaskToBoard(task);
        modal.hide();
        taskForm.trigger('reset');
    });

    $(document).on('click', '.delete-task', function() {
        const taskId = $(this).closest('.task').data('id');
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(task => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        $(this).closest('.task').remove();
    });

    $('.lane').sortable({
        connectWith: '.lane',
        receive: function(event, ui) {
            const newStatus = $(this).attr('id').replace('-cards', '');
            const taskId = ui.item.data('id');
            updateTaskStatus(taskId, newStatus);
        }
    }).disableSelection();

    loadTasks();
});
