import { getTasks, createTask, uptadeTask, deleteTask } from "./tasks-api"

let todos = []

function loadTasks() {
    buttonAddTask.hidden = true
    getTasks()
    .then(data => {
        console.table(data)
        todos = data
        
        const activeTodo = todos.find(t => t.id === activeTodoId && !t.completed)
        if (!activeTodo) {
            activeTodoId = null
            currentTaskName.textContent = 'Nenhuma tarefa selecionada'
        } else {
            currentTaskName.textContent = activeTodo.description
        }
        
        renderAll()
    })
    .finally(() => {
        buttonAddTask.hidden = false
    })
}

const taskBoard = document.querySelector('.task-board')
const form = document.querySelector('.task-form')
const formLabel = document.querySelector('.task-form__label')
const todoTextarea = document.querySelector('#task-input')
const todosList = document.querySelector('.task-list')
const menu = document.querySelector('.task-menu')
const buttonAddTask = document.querySelector('.add-task-button')
const buttonDeleteTask = document.querySelector('#btn-delete')
const currentTaskName = document.querySelector('.current-task__name')

let editingTodo = null

function toggleForm() {
    form.hidden = !form.hidden
    buttonAddTask.hidden = !buttonAddTask.hidden
}

function resetFormState() {
    form.reset()
    formLabel.textContent = 'Adicionando tarefa'
    editingTodo = null
    buttonDeleteTask.hidden = true
}

let activeTodoId = null

function handleSelectTodo(event) {
    const todo = findTodoFromEvent(event)
    if (!todo || todo.completed) return

    activeTodoId = todo.id
    currentTaskName.textContent = todo.description
    renderAll()
}

function handleCancelForm() {
    toggleForm()
    resetFormState()
    form.reset()
}

async function handleDeleteTodo() {
    if (editingTodo) {
        await deleteTask(editingTodo.id)
        resetFormState()
        toggleForm()
        loadTasks()
    }
}

async function handleClearCompleted() {
    menu.open = false
    await Promise.all(todos.filter(t => t.completed).map(t => {
        return deleteTask(t.id)
    }))
    loadTasks()
}

async function handleClearAll() {
    menu.open = false
    await Promise.all(todos.map(t => {
        return deleteTask(t.id)
    }))
    loadTasks()
}

function findTodoFromEvent(event) {
    const todoId = event.target.closest('[data-todo-id]')?.dataset.todoId
    return todos.find(t => t.id === todoId)
}

async function handleToggleStatus(event) {
    const todo = findTodoFromEvent(event)
    if (!todo) return

    todo.completed = !todo.completed
    await uptadeTask(todo.id, todo)
    loadTasks()
}

function handleEditTodo(event) {
    const todo = findTodoFromEvent(event)
    if (!todo) return

    if (form.hidden) {
        toggleForm()
    }
    buttonDeleteTask.hidden = false
    formLabel.textContent = 'Editando tarefa'
    todoTextarea.value = todo.description
    editingTodo = todo
}

const actions = {
    'toggle-form': toggleForm,
    'cancel-form': handleCancelForm,
    'delete-todo': handleDeleteTodo,
    'clear-completed': handleClearCompleted,
    'clear-all': handleClearAll,
    'toggle-status': handleToggleStatus,
    'edit-todo': handleEditTodo,
    'select-todo': handleSelectTodo,
}

taskBoard.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action
    if (action && actions[action]) {
        actions[action](event)
    }
})

form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const formData = new FormData(form)
    const description = formData.get('task')

    if (editingTodo) {
        editingTodo.description = formData.get('task')
        await uptadeTask(editingTodo.id, editingTodo)
        loadTasks()
        toggleForm()
        resetFormState()
    } else {
        await createTask(description)
        loadTasks()
        toggleForm()
        resetFormState()
    }
})

function renderTodoListItem(todo) {
    const listItem = document.createElement('li')

    listItem.classList.add('task-list__item')

    listItem.dataset.action = 'select-todo'
    listItem.dataset.todoId = todo.id

    if (todo.id === activeTodoId) {
        listItem.classList.add('task-list__item--active')
    }

    if (todo.completed) {
        listItem.classList.add('task-list__item--complete')
    }

    const statusButton = document.createElement('button')
    statusButton.type = 'button'
    statusButton.classList.add('task-list__status')
    statusButton.dataset.action = 'toggle-status'
    statusButton.dataset.todoId = todo.id
    statusButton.setAttribute('aria-pressed', todo.completed)

    if (todo.completed) {
        statusButton.setAttribute('aria-label', 'Marcar tarefa como concluída')
    } else {
        statusButton.setAttribute('aria-label', 'Marcar tarefa como pendente')
    }

    const statusIcon = document.createElement('img')
    statusIcon.src = todo.completed ? '/icons/check_circle.svg' : '/icons/check_circle_pending.svg'

    const paragraph = document.createElement('p')
    paragraph.classList.add('task-list__description')
    paragraph.textContent = todo.description

    const editButton = document.createElement('button')
    editButton.type = 'button'
    editButton.classList.add('task-list__edit')
    editButton.dataset.action = 'edit-todo'
    editButton.dataset.todoId = todo.id
    editButton.setAttribute('aria-label', 'Editar tarefa')

    const editIcon = document.createElement('span')
    editIcon.classList.add('icon', 'icon--edit', 'icon--lg')
    editIcon.setAttribute('aria-hidden', 'true')
    editButton.appendChild(editIcon)

    statusButton.appendChild(statusIcon)
    listItem.appendChild(statusButton)
    listItem.appendChild(paragraph)
    listItem.appendChild(editButton)

    return listItem
}

function renderAll() {
    console.group('todo.js')
    console.time('render')
    todosList.innerHTML = ''
    todos.forEach(todo => {
        const element = renderTodoListItem(todo)
        todosList.appendChild(element)
    })

    console.timeEnd('render')
    console.groupEnd()
}

loadTasks()