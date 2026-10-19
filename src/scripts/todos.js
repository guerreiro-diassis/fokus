let todosFromStorage = localStorage.getItem('todos')
let todos = todosFromStorage ? JSON.parse(todosFromStorage) : []

const form = document.querySelector('.task-form')
const formLabel = document.querySelector('.task-form__label')
const todoTextarea = document.querySelector('#task-input')
const todosList = document.querySelector('.task-list')

const buttonClearCompleted = document.querySelector('#btn-clear-completed')
const buttonClearAll = document.querySelector('#btn-clear-all')
const menu = document.querySelector('.task-menu')

const buttonAddTask = document.querySelector('.add-task-button')
const buttonDeleteTask = document.querySelector('#btn-delete')
const buttonCancelAddTask = document.querySelector('#btn-cancel')

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

buttonAddTask.addEventListener('click', toggleForm)
buttonCancelAddTask.addEventListener('click', () => {
  toggleForm()
  resetFormState()
  form.reset()
})

buttonDeleteTask.addEventListener('click', () => {
  if (editingTodo) {
    todos = todos.filter(t => t != editingTodo)
    resetFormState()
    toggleForm()
    renderAll()
  }
})



buttonClearCompleted.addEventListener('click', () => {
  menu.open = false

  todos = todos.filter(t => !t.completed)
  renderAll()
})

buttonClearAll.addEventListener('click', () => {
  menu.open = false

  todos = [];
  todosList.innerHTML = ''
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
  statusButton.setAttribute('aria-pressed', todo.completed)

  statusButton.addEventListener('click', () => {
    todo.completed = !todo.completed
    renderAll()
  })

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
  editButton.setAttribute('aria-label', 'Editar tarefa')

  editButton.addEventListener('click', () => {
    if (form.hidden) {
      toggleForm()
    }
    buttonDeleteTask.hidden = false
    formLabel.textContent = 'Editando tarefa'
    todoTextarea.value = todo.description
    editingTodo = todo
  })

  const editIcon = document.createElement('span')
  editIcon.classList.add('icon', 'icon--edit', 'icon--lg')
  editIcon.setAttribute('aria-hidden', 'true')


  listItem.appendChild(statusButton)
  statusButton.appendChild(statusIcon)
  listItem.appendChild(paragraph)
  listItem.appendChild(editButton)
  editButton.appendChild(editIcon)

  return listItem
}



function renderAll () {
  localStorage.setItem('todos', JSON.stringify(todos))
  todosList.innerHTML = ''
  todos.forEach(todo => {
    const element = renderTodoListItem(todo)
  
    todosList.appendChild(element)
    
  })
}

renderAll()

