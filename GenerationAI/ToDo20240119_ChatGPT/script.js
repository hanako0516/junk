document.getElementById('addBtn').addEventListener('click', addTodoItem);
document.getElementById('shareBtn').addEventListener('click', shareTodoList);

function addTodoItem() {
    const todoList = document.getElementById('todoList');
    const template = document.getElementById('todoItemTemplate').content.cloneNode(true);
    
    const checkbox = template.querySelector('.complete-checkbox');
    const title = template.querySelector('.todo-title');
    const dueDate = template.querySelector('.due-date');
    
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            title.classList.add('strikethrough');
        } else {
            title.classList.remove('strikethrough');
        }
    });

    dueDate.addEventListener('input', () => {
        const today = new Date().toISOString().split('T')[0];
        if (dueDate.value < today) {
            template.querySelector('.todo-item').classList.add('overdue');
        } else {
            template.querySelector('.todo-item').classList.remove('overdue');
        }
    });

    todoList.appendChild(template);
}

function shareTodoList() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        alert("URLをクリップボードにコピーしました！");
    }).catch(err => {
        console.error('クリップボードにコピーできませんでした: ', err);
    });
}

// TODOアイテムの削除 (スライド動作で削除)
const todoList = document.getElementById('todoList');
let draggedItem = null;

todoList.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('todo-item')) {
        draggedItem = e.target;
    }
});

todoList.addEventListener('dragover', (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(todoList, e.clientY);
    if (afterElement == null) {
        todoList.appendChild(draggedItem);
    } else {
        todoList.insertBefore(draggedItem, afterElement);
    }
});

todoList.addEventListener('dragend', () => {
    draggedItem = null;
});

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.todo-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}
