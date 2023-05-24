const addTodoBtn = document.getElementById('add-todo-btn');
const todosNav = document.getElementById('todos-nav');
let todoListArray = [];
let todosFilter = 'all';
let filteredTodos = [];

const saveTodos = () => {
    const todoListJson = JSON.stringify(todoListArray);
    localStorage.setItem('todoList', todoListJson)
}

const getTodos = () => JSON.parse(localStorage.getItem('todoList')) || [];

addTodoBtn.addEventListener('click', (event) => {
    event.preventDefault();

    const todoText = document.getElementById('todo-text').value;
    const todoDate = document.getElementById('todo-date').value;

    if (todoText && todoDate) {
        const todo = {
            text: todoText,
            date: todoDate,
            state: 'pending',
            id: new Date().getTime()
        }

        todoListArray = [...todoListArray, todo];

        saveTodos();
        loadTodos();

        document.getElementById('todo-text').value = '';
        document.getElementById('todo-date').value = '';
    }
})

const loadTodos = () => {
    const todosList = sortTodos();
    const todoList = document.getElementById('todos-list');
    todoList.innerHTML = '';

    if (todoList.length === 0) {
        const emptyListString = `No todo's added!`;
        todoList.innerHTML = `<p style="text-align:center;">${emptyListString}</p>`;       
    } else {
        todoList.array.forEach(todo => {
            const todoItem = document.createElement('li')
            todoItem.dataset.id = todo.id;
            todoItem.classList = todo.state;

            const todoElement = createTodoElement(todo);
            todoItem.innerHTML = todoElement;
            todoList.appendChild(todoItem);
        });
    }
}


const sortTodos = () => {
    const todoList = getTodos();
    todoListArray = getTodos();

    todoList.sort((a, b) => {
        if (a.state === b.state) {
            return new Date(a.date) - new Date(b.date);
        } else {
            return a.state === 'completed' ? 1 : -1;
        }
    })


    return todoList;
};

const createTodoElement = (todo) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const overdue = dateStringToDate(formatDate(todo.date)) < today && todo.state === 'pending';
    const todoDateClass = overdue ? 'todo-date-overdue' : 'todo-date';
    const todoButtonIconClass = todo.state === 'pending' ? 'fa-circle' : 'fa-circle-check';

    return `
    <div class="todo"?>
        <button class="todo-btn"><i class="fa-regular ${todoButtonIconClass}"></i></button>
        <div>
            <p class="todo-text">${todo.text}</p>
            <span class="${todoDateClass}">${formatDate(todo.date)}</span>
        </div>
    </div>
    <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
    `;
};

const dateStringToDate = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return new Date(year, month - 1, day);
}

const formatDate = (todoDate) => {
    const date = new Date(todoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

loadTodos();