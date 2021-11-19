class Task {
    constructor(taskName, taskDone, taskDescription, taskDate) {
        if(typeof taskName === 'object'){
            Object.assign(this, taskName);
            this.taskDone = false;
            this.taskDate = new Date(taskName.taskDate);
        }else{
            this.taskName = taskName;
            this.taskDone = taskDone === undefined? false: taskDone;
            this.taskDescription = taskDescription;
            this.taskDate = new Date(taskDate);
        }
    }
}

class TodoList {
    parentElement = document.querySelector('.tasks');
    showAllCheckBox = document.querySelector('#show-all-checkbox'); 

    constructor(tasks){
        this.tasks = tasks;
        tasks.forEach(element => {
            this.createElementAndAppend(element);
        });
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
        taskElement.taskDateElement.innerText = task.taskDate.toISOString().split('T')[0];
        if (taskElement.taskDoneElement.checked) {
            taskElement.taskNameElement.classList.add('task-name-done');
        }
        if (new Date() > task.taskDate){
            taskElement.taskDateElement.classList.toggle('date-red', taskElement.taskDoneElement.checked);
        }
    }

    addEvents(task, taskElement) {
        //Event on task checkbox 
        taskElement.taskDoneElement.addEventListener('change', (event) => {
            taskElement.taskNameElement.classList.toggle('task-name-done', taskElement.taskDoneElement.checked);
        });
        //Event on delete button
        taskElement.taskDeleteButton.addEventListener('click', (event) => {
            taskElement.taskElement.remove();
            tasks.splice(tasks.indexOf(taskElement.taskObject), 1);
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

    addTaskEvent(){
        const addTaskForm = document.forms['add-task'];
        addTaskForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(addTaskForm);
            let newTask = new Task(Object.fromEntries(formData.entries()));
            //Add task to array and UI
            tasks.push(newTask);
            this.createElementAndAppend(newTask);
            //Clear form
            addTaskForm.reset();
        })
    }
}

let tasks = [
    new Task('Test 1', true, 'Test 1 Description', '2020-10-11'),
    new Task('Test 2', true, 'Test 2 Description', '2020-10-12'),
    new Task('Test 3', false, 'Test 3 Description', '2021-11-19')
]

let todoList = new TodoList(tasks);
