const corePath = 'http://localhost:5000/api/';
const getTasksEndpoint = corePath + 'tasks?listId=16&all=true';
const postTaskEndpoint = corePath + 'tasks?listId=16';
const deleteTaskEndpoint = corePath + 'tasks/';
const patchTaskEndpoint = corePath + 'tasks/'

class Task {
    constructor(taskName, taskDone, taskDescription, taskDate) {
        if (typeof taskName === 'object') {
            Object.assign(this, taskName);
            this.taskDone = false;
            this.taskDate = taskName.taskDate;
        } else {
            this.taskName = taskName;
            this.taskDone = taskDone === undefined ? false : taskDone;
            this.taskDescription = taskDescription;
            this.taskDate = new Date(taskDate);
        }
    }
}

class TodoList {
    parentElement = document.querySelector('.tasks');
    showAllCheckBox = document.querySelector('#show-all-checkbox');
    constructor(tasks) {
        this.tasks = tasks;
        /*tasks.forEach(element => {
            this.createElementAndAppend(element);
        });*/
        this.getTasksFromServer().then(date => date.forEach(element => {
            this.createElementAndAppend(element);
        }));
        this.addTaskEvent();
    }

    createElement(elementTag, elementClass, elementType) {
        let newElement = document.createElement(elementTag);
        newElement.classList.add(elementClass);
        if (elementType !== undefined) {
            newElement.type = elementType;
        }
        return newElement;
    }

    appendToParent(taskElement, parentElement) {
        taskElement.taskStatusDiv.appendChild(taskElement.taskNameElement);
        taskElement.taskStatusDiv.appendChild(taskElement.taskDoneElement);
        taskElement.taskStatusDiv.appendChild(taskElement.taskDeleteButton);
        taskElement.taskElement.appendChild(taskElement.taskStatusDiv);
        taskElement.taskElement.appendChild(taskElement.taskDescElement);
        taskElement.taskElement.appendChild(taskElement.taskDateElement);
        this.parentElement.appendChild(taskElement.taskElement);
    }

    addTaskInfo(task, taskElement) {
        taskElement.taskNameElement.innerText = task.taskName;
        taskElement.taskDoneElement.checked = task.taskDone;
        taskElement.taskDeleteButton.innerText = 'X';
        taskElement.taskDescElement.innerText = task.taskDescription;
        //Date check
        if (taskElement.taskDoneElement.checked) {
            taskElement.taskNameElement.classList.add('task-name-done');
        }
        if (task.taskDate != null) {
            taskElement.taskDateElement.innerText = task.taskDate.split('T')[0];
            if (new Date() > task.taskDate) {
                taskElement.taskDateElement.classList.toggle('date-red', taskElement.taskDoneElement.checked);
            }
        } else {
            taskElement.taskDateElement.classList.add('nonvisible');
        }

    }

    addEvents(task, taskElement) {
        //Event on task checkbox 
        taskElement.taskDoneElement.addEventListener('change', (event) => {
            task.taskDone = taskElement.taskDoneElement.checked;
            taskElement.taskNameElement.classList.toggle('task-name-done', taskElement.taskDoneElement.checked);
            this.patchTaskState(task).then(() => {
                console.log('OK!');
            })
        });
        //Event on delete button
        taskElement.taskDeleteButton.addEventListener('click', (event) => {
            taskElement.taskElement.remove();
            this.deleteTaskFromServer(task.taskId);
        })
        //Show all event
        this.showAllCheckBox.addEventListener('change', (event) => {
            this.showAllCheckBox.addEventListener('change', (event) => taskElement.taskElement.classList.toggle('nonvisible', (!this.showAllCheckBox.checked && taskElement.taskDoneElement.checked)));
        })
    }

    createElementAndAppend(task) {
        let newTaskDiv = this.createElement('div', 'task');
        let newTaskStatusDiv = this.createElement('div', 'task-status');
        let newTaskNameLabel = this.createElement('h1', 'task-name');
        let newTaskDoneCheckBox = this.createElement('input', 'task-done', 'checkbox');
        let newTaskDescriptionLabel = this.createElement('h2', 'task-description');
        let newTaskDateLabel = this.createElement('h2', 'task-date');
        let newTaskDeleteButton = this.createElement('button', 'task-delete-button');

        let taskElement = {
            taskObject: task,
            taskElement: newTaskDiv,
            taskStatusDiv: newTaskStatusDiv,
            taskNameElement: newTaskNameLabel,
            taskDoneElement: newTaskDoneCheckBox,
            taskDescElement: newTaskDescriptionLabel,
            taskDateElement: newTaskDateLabel,
            taskDeleteButton: newTaskDeleteButton
        };

        this.addTaskInfo(task, taskElement);
        this.addEvents(task, taskElement);
        this.appendToParent(taskElement, this.parentElement);

        return taskElement;
    }

    addTaskEvent() {
        const addTaskForm = document.forms['add-task'];
        addTaskForm.addEventListener('submit', (event) => {
            event.preventDefault();
            //Get task from form
            const formData = new FormData(addTaskForm);
            let newTask = new Task(Object.fromEntries(formData.entries()));
            //Post task on server and add to UI
            let taskPostObject = {
                title: newTask.taskName,
                description: newTask.taskDescription,
                dueDate: newTask.taskDate,
                done: newTask.taskDone
            }
            this.postTask(taskPostObject).then(() => {
                this.createElementAndAppend(newTask);
            });
            //Clear form
            addTaskForm.reset();
        })
    }

    getTasksFromServer() {
        return fetch(getTasksEndpoint, {
            method: 'GET',
        }).then(response => response.json());
    }

    deleteTaskFromServer(taskId) {
        return fetch(deleteTaskEndpoint + taskId, {
            method: 'DELETE'
        }).then(response => response.json());
    }

    postTaskToServer(task) {
        return fetch(postTaskEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        }).then(response => response.json);
    }

    patchTaskState(task) {
        console.log(patchTaskEndpoint + task.taskId);
        let taskObject = [{
            "path": "Done",
            "op": "add",
            "value": task.taskDone
        }]
        return fetch(patchTaskEndpoint + task.taskId, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json-patch+json"
            },
            body: JSON.stringify(taskObject)
        })
    }
}

let tasks = [
    new Task('Test 1', true, 'Test 1 Description', '2020-10-11'),
    new Task('Test 2', true, 'Test 2 Description', '2020-10-12'),
    new Task('Test 3', false, 'Test 3 Description', '2021-11-19')
]

let todoList = new TodoList(tasks);
