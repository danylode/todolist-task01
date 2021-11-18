class Task{
    constructor (taskName, taskDone, taskDescription, taskDate){
        this.taskName = taskName;
        this.taskDone = taskDone;
        this.taskDescription = taskDescription;
        this.taskDate = new Date(taskDate);
    }
}

let currentDate = new Date();

let tasks = [
    new Task('Test 1', true, 'Test 1 Description', '2020-10-11'),
    new Task('Test 2', true, 'Test 2 Description', '2020-10-12'),
    new Task('Test 3', false, 'Test 3 Description', '2021-11-19')
]


function renderTask(task){
    let tasksElement = document.querySelector('.tasks');

    //New task div
    let newTaskElement = document.createElement('div');
    newTaskElement.classList.add('task');

    //New task status element
    let newTaskStatusElement = document.createElement('div')
    newTaskStatusElement.classList.add('task-status');


    // Task status add
    let newTaskNameElement = document.createElement('h1');
    newTaskNameElement.classList.add('task-name');
    newTaskNameElement.innerText = task.taskName;

    let newTaskCheckBoxElement = document.createElement('input');
    newTaskCheckBoxElement.classList.add('task-done');
    newTaskCheckBoxElement.type = 'checkbox';

    //Add done event on checkbox
    newTaskCheckBoxElement.addEventListener('change', () => {
        newTaskNameElement.classList.toggle('task-name-done', newTaskCheckBoxElement.checked);
        newTaskDateElement.classList.toggle('date-red', newTaskCheckBoxElement.checked);
    })

    if(task.taskDone == true){
        newTaskNameElement.classList.add('task-name-done');
        newTaskCheckBoxElement.checked = true;
    }

    //Add delete button
    let newTaskDeleteButton = document.createElement('button');
    newTaskDeleteButton.classList.add('task-delete-button');
    newTaskDeleteButton.innerText = 'X';
    newTaskDeleteButton.addEventListener('click', () => {
        newTaskElement.remove();
        tasks.splice(tasks.indexOf(tasks),1);
        console.log(tasks);
    })

    newTaskStatusElement.appendChild(newTaskNameElement);
    newTaskStatusElement.appendChild(newTaskCheckBoxElement);
    newTaskStatusElement.appendChild(newTaskDeleteButton);

    //Task description add
    let newTaskDescriptionElement = document.createElement('h2');
    newTaskDescriptionElement.classList.add('task-description');
    newTaskDescriptionElement.innerText = task.taskDescription;

    //Task date add
    let newTaskDateElement = document.createElement('h2');
    newTaskDateElement.classList.add('task-date');
    if(new Date() >= task.taskDate){
        newTaskDateElement.classList.add('date-red');
    }
    newTaskDateElement.innerText = task.taskDate.toISOString().split('T')[0];

    //add change event on showInProgress button
    let showAll = document.querySelector('#show-all-checkbox');
    showAll.addEventListener('change', () => {
        newTaskElement.classList.toggle('nonvisible', (newTaskCheckBoxElement.checked && !showAll.checked));
    })

    newTaskElement.appendChild(newTaskStatusElement);
    newTaskElement.appendChild(newTaskDescriptionElement);
    newTaskElement.appendChild(newTaskDateElement);
    tasksElement.appendChild(newTaskElement);
}


tasks.forEach(renderTask);