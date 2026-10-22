let todosFromStorage = localStorage.getItem('todos')
let todos = todosFromStorage ? JSON.parse(todosFromStorage) : []
const taskBoard = document.querySelector('.task-board')
const form = document.querySelector('.task-form')
const formLabel = document.querySelector('.task-form__label')
const todoTextarea = document.querySelector('#task-input')
const todosList = document.querySelector('.task-list')
const menu = document.querySelector('.task-menu')
const buttonAddTask = document.querySelector('.add-task-button')
const buttonDeleteTask = document.querySelector('#btn-delete')

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

function handleCancelForm() {
    toggleForm()
    resetFormState()
    form.reset()
}

function handleDeleteTodo() {
    if (editingTodo) {
        todos = todos.filter(t => t !== editingTodo)
    }
    resetFormState()
    toggleForm()
    renderAll()
}

function handleClearCompleted() {
    menu.open = false
    todos = todos.filter(t => !t.completed)
    renderAll()
}

function handleClearAll() {
    menu.open = false
    todos = []
    todosList.innerHTML = ''
}

function findTodoFromEvent(event) {
    const todoId = Number(event.target.closest('[data-todo-id]')?.dataset.todoId)
    return todos.find(t => t.id === todoId)
}

function handleToggleStatus(event) {
    const todo = findTodoFromEvent(event)
    if (!todo) return

    todo.completed = !todo.completed
    renderAll()
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
}

taskBoard.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action
    if (action && actions[action]) {
        actions[action](event)
    }
})

form.addEventListener('submit', (event) => {
    event.preventDefault()

    const formData = new FormData(form)

    if (editingTodo) {
        editingTodo.description = formData.get('task')
    } else {
        const todo = {
            id: Date.now(),
            description: formData.get('task'),
            completed: false
        }
        todos.push(todo)
    }

    renderAll()
    toggleForm()
    resetFormState()
})

function renderTodoListItem(todo) {
    const listItem = document.createElement('li')

    listItem.classList.add('task-list__item')

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
    localStorage.setItem('todos', JSON.stringify(todos))
    todosList.innerHTML = ''
    todos.forEach(todo => {
        const element = renderTodoListItem(todo)
        todosList.appendChild(element)
    })
}

renderAll()