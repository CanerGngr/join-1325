/**
 * @fileoverview Drag-and-drop handlers for Kanban board columns.
 * Provides drag start/end/over/drop logic and visual feedback.
 * @version 1.0.0
 * @author Join-1325 Development Team
 */
let draggedElement = null;
let dropPlaceholder = null;

/**
 * Handles the handleDragStart workflow.
 * @function handleDragStart
 */
function handleDragStart(event, element) {
    draggedElement = element;
    element.classList.add('dragging');
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', element.outerHTML);
}


/**
 * Handles the handleDragEnd workflow.
 * @function handleDragEnd
 */
function handleDragEnd(element) {
    element.classList.remove('dragging');
    draggedElement = null;
    removePlaceholder();
    clearAllColumnDragStyles();
}


/**
 * Removes drag-over/drag-active styles from every Kanban column.
 * @function clearAllColumnDragStyles
 */
function clearAllColumnDragStyles() {
    const columns = getKanbanColumnElements();
    for (let i = 0; i < columns.length; i++) {
        columns[i].classList.remove('drag-over', 'drag-active');
    }
}


/**
 * Returns the four Kanban column elements in board order.
 * @function getKanbanColumnElements
 */
function getKanbanColumnElements() {
    const ids = ['todo', 'in-progress', 'await-feedback', 'done'];
    const cols = [];
    for (let i = 0; i < ids.length; i++) cols.push(document.getElementById(ids[i]));
    return cols;
}


/**
 * Handles the handleDragOver workflow.
 * @function handleDragOver
 */
function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    updateColumnDragHighlight(event);
    return false;
}


/**
 * Updates which column shows drag-over highlight based on pointer position.
 * @function updateColumnDragHighlight
 * @param {DragEvent} event - The drag event
 */
function updateColumnDragHighlight(event) {
    const columns = getKanbanColumnElements();
    const targetColumn = findTargetColumn(columns, event);
    if (targetColumn && draggedElement) updatePlaceholderForTarget(targetColumn, event);
}


/**
 * Finds the column under the pointer and toggles drag-over on all columns.
 * @function findTargetColumn
 */
function findTargetColumn(columns, event) {
    let target = null;
    for (let i = 0; i < columns.length; i++) {
        const rect = columns[i].getBoundingClientRect();
        const inside = event.clientX >= rect.left && event.clientX <= rect.right &&
                       event.clientY >= rect.top && event.clientY <= rect.bottom;
        columns[i].classList.toggle('drag-over', inside);
        if (inside) target = columns[i];
    }
    return target;
}


/**
 * Moves the drop placeholder into the current target column.
 * @function updatePlaceholderForTarget
 */
function updatePlaceholderForTarget(targetColumn, event) {
    const container = document.getElementById(targetColumn.id + '-cards');
    const afterElement = getDragAfterElement(container, event.clientY);
    updatePlaceholder(container, afterElement);
}


/**
 * Creates or updates the drop placeholder.
 * @function updatePlaceholder
 * @param {HTMLElement} container - Target container
 * @param {HTMLElement} afterElement - Element to insert placeholder before
 */
function updatePlaceholder(container, afterElement) {
    if (!dropPlaceholder) {
        const placeholderHTML = `<div class="drop-placeholder" style="height: ${draggedElement.offsetHeight}px; width: ${draggedElement.offsetWidth}px;"></div>`;
        container.insertAdjacentHTML('beforeend', placeholderHTML);
        dropPlaceholder = container.lastElementChild;
    }

    if (afterElement) {
        afterElement.before(dropPlaceholder);
    } else {
        container.append(dropPlaceholder);
    }
}


/**
 * Removes the drop placeholder.
 * @function removePlaceholder
 */
function removePlaceholder() {
    if (dropPlaceholder) {
        dropPlaceholder.remove();
        dropPlaceholder = null;
    }
}



/**
 * Handles the handleDrop workflow.
 * @function handleDrop
 */
async function handleDrop(event, element) {
    event.stopPropagation();
    removePlaceholder();
    const targetContainer = document.getElementById(element.id + '-cards');
    insertDraggedElement(targetContainer, event.clientY);
    await updateTaskStatusInDrag(draggedElement, element.id);
    element.classList.remove('drag-over', 'drag-active');
    return false;
}


/**
 * Inserts the currently dragged element into the target container at the
 * position indicated by the pointer's Y coordinate.
 * @function insertDraggedElement
 */
function insertDraggedElement(container, clientY) {
    const afterElement = getDragAfterElement(container, clientY);
    if (afterElement == null) container.append(draggedElement);
    else afterElement.before(draggedElement);
}


/**
 * Handles the getDragAfterElement workflow.
 * @function getDragAfterElement
 */
function getDragAfterElement(container, y) {
    const draggables = collectDraggableTaskCards(container);
    return findClosestBelowPointer(draggables, y);
}


/**
 * Returns task-card children of the container that are not currently being dragged.
 * @function collectDraggableTaskCards
 */
function collectDraggableTaskCards(container) {
    const result = [];
    const children = container.children;
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.classList.contains('task-card') && !child.classList.contains('dragging')) {
            result.push(child);
        }
    }
    return result;
}


/**
 * Returns the element whose vertical center is just below the pointer Y.
 * @function findClosestBelowPointer
 */
function findClosestBelowPointer(elements, y) {
    let closest = null;
    let closestOffset = Number.NEGATIVE_INFINITY;
    for (let i = 0; i < elements.length; i++) {
        const box = elements[i].getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closestOffset) {
            closestOffset = offset;
            closest = elements[i];
        }
    }
    return closest;
}


/**
 * Handles the updateTaskStatusInDrag workflow.
 * @function updateTaskStatusInDrag
 */
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

/**
 * Handles the handleDragEnter workflow.
 * @function handleDragEnter
 */
function handleDragEnter(element) {
    // Highlighting is managed by dragover - no action needed here
}

/**
 * Handles the handleDragLeave workflow.
 * @function handleDragLeave
 */
function handleDragLeave(event, element) {
    // Leave highlighting is managed by dragover - no action needed here
}

