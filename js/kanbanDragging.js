/**
 * @fileoverview Drag-and-drop handlers for Kanban board columns.
 * Provides drag start/end/over/drop logic and visual feedback.
 * @version 1.0.0
 * @author Join-1325 Development Team
 */
let draggedElement = null;

function handleDragStart(event, element) {
    draggedElement = element;
    element.classList.add('dragging');
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', element.outerHTML);
}


function handleDragEnd(element) {
    element.classList.remove('dragging');
    draggedElement = null;

    let todoColumn = document.getElementById('todo');
    let inProgressColumn = document.getElementById('in-progress');
    let awaitFeedbackColumn = document.getElementById('await-feedback');
    let doneColumn = document.getElementById('done');

    todoColumn.classList.remove('drag-over', 'drag-active');
    inProgressColumn.classList.remove('drag-over', 'drag-active');
    awaitFeedbackColumn.classList.remove('drag-over', 'drag-active');
    doneColumn.classList.remove('drag-over', 'drag-active');
}


function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    return false;
}


function handleDragEnter(element) {
    element.classList.add('drag-over');
}


function handleDragLeave(event, element) {
    if (!element.contains(event.relatedTarget)) {
        element.classList.remove('drag-over');
    }
}


async function handleDrop(event, element) {
    event.stopPropagation();
    const targetContainer = document.getElementById(element.id + '-cards');
    const afterElement = getDragAfterElement(targetContainer, event.clientY);
    if (afterElement == null) {
        targetContainer.appendChild(draggedElement);
    } else {
        targetContainer.insertBefore(draggedElement, afterElement);
    }
    await updateTaskStatusInDrag(draggedElement, element.id);
    element.classList.remove('drag-over', 'drag-active');
    return false;
}


function getDragAfterElement(container, y) {
    let draggableElements = [];
    let children = container.children;

    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        if (child.classList.contains('task-card') && !child.classList.contains('dragging')) {
            draggableElements.push(child);
        }
    }

    let closestElement = null;
    let closestOffset = Number.NEGATIVE_INFINITY;

    for (let i = 0; i < draggableElements.length; i++) {
        let child = draggableElements[i];
        let box = child.getBoundingClientRect();
        let offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closestOffset) {
            closestOffset = offset;
            closestElement = child;
        }
    }

    return closestElement;
}


async function updateTaskStatusInDrag(taskElement, columnId) {
    const taskId = taskElement.getAttribute('data-task-id');
    const statusMapping = {
        'todo': 'todo',
        'in-progress': 'in-progress', 
        'await-feedback': 'await-feedback',
        'done': 'done'
    };
    
    const newStatus = statusMapping[columnId];
    
    if (newStatus) {
        // Verwende die globale updateTaskStatus Funktion aus task-management.js
        await window.updateTaskStatus(taskId, newStatus);
    }
}

