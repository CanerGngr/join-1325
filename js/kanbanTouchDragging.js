/**
 * @fileoverview Touch drag-and-drop support for Kanban board on mobile devices.
 * Uses a long-press gesture (300ms hold) to activate drag mode, which avoids
 * conflict with horizontal board scrolling and eliminates the cancelable=false warning.
 * @version 1.1.0
 */

let touchDraggedElement = null;
let touchClone          = null;
let touchOffsetX        = 0;
let touchOffsetY        = 0;
let touchStartX         = 0;
let touchStartY         = 0;
let touchLongPressTimer = null;
let touchDragActive     = false;

const LONG_PRESS_MS     = 300;


/**
 * Called on touchstart.
 * Starts a timer — if the finger stays still for LONG_PRESS_MS the drag activates.
 * Does NOT call preventDefault here so horizontal board scroll remains unblocked.
 * @param {TouchEvent} event
 * @param {HTMLElement} element - The task card element
 */
function handleTouchStart(event, element) {
    const touch = event.touches[0];
    const rect = element.getBoundingClientRect();

    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchOffsetX = touch.clientX - rect.left;
    touchOffsetY = touch.clientY - rect.top;
    touchDragActive = false;

    touchLongPressTimer = setTimeout(() => activateTouchDrag(element, rect, touch), LONG_PRESS_MS);
}


/**
 * Activates touch-drag mode: marks the card, creates a floating clone at the
 * current finger position and appends it to the body.
 * @function activateTouchDrag
 */
function activateTouchDrag(element, rect, touch) {
    touchDraggedElement = element;
    touchDragActive = true;
    element.classList.add('dragging');
    touchClone = element.cloneNode(true);
    touchClone.classList.add('touch-drag-clone');
    touchClone.style.width = rect.width + 'px';
    touchClone.style.left = (touch.clientX - touchOffsetX) + 'px';
    touchClone.style.top = (touch.clientY - touchOffsetY) + 'px';
    document.body.appendChild(touchClone);
}


/**
 * Called on touchmove.
 * Cancels the long-press timer if the finger moved significantly (it's a scroll).
 * Once drag is active, moves the clone and highlights the column under the finger.
 * @param {TouchEvent} event
 */
function handleTouchMove(event) {
    const touch = event.touches[0];
    if (!touchDragActive) {
        cancelLongPressIfScrolling(touch);
        return;
    }
    event.preventDefault();
    moveTouchClone(touch);
    highlightColumnUnderTouch(touch);
}


/**
 * Cancels the pending long-press timer if the finger has moved enough to be a scroll.
 * @function cancelLongPressIfScrolling
 */
function cancelLongPressIfScrolling(touch) {
    const dx = Math.abs(touch.clientX - touchStartX);
    const dy = Math.abs(touch.clientY - touchStartY);
    if (dx > 8 || dy > 8) {
        clearTimeout(touchLongPressTimer);
        touchLongPressTimer = null;
    }
}


/**
 * Moves the floating clone to follow the finger.
 * @function moveTouchClone
 */
function moveTouchClone(touch) {
    touchClone.style.left = (touch.clientX - touchOffsetX) + 'px';
    touchClone.style.top = (touch.clientY - touchOffsetY) + 'px';
}


/**
 * Highlights the kanban column currently under the finger.
 * @function highlightColumnUnderTouch
 */
function highlightColumnUnderTouch(touch) {
    const columns = getKanbanColumnElements();
    for (let i = 0; i < columns.length; i++) columns[i].classList.remove('drag-over');
    touchClone.style.display = 'none';
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    touchClone.style.display = '';
    if (!elementBelow) return;
    const targetColumn = elementBelow.closest('.kanban-column');
    if (targetColumn) targetColumn.classList.add('drag-over');
}


/**
 * Called on touchend.
 * Cancels the timer if it hasn't fired yet.
 * If drag was active, moves the real card to the target column and saves status.
 * @param {TouchEvent} event
 */
async function handleTouchEnd(event) {
    clearTimeout(touchLongPressTimer);
    touchLongPressTimer = null;
    if (!touchDragActive || !touchDraggedElement) { touchDragActive = false; return; }
    const touch = event.changedTouches[0];
    const columns = getKanbanColumnElements();
    const targetColumn = findColumnAtPoint(columns, touch.clientX, touch.clientY);
    removeTouchClone();
    clearTouchDragStyles(columns);
    if (targetColumn) await dropTouchTaskInColumn(targetColumn, touch.clientY);
    resetTouchDragState();
}


/**
 * Returns the first column element whose bounding box contains the given point.
 * @function findColumnAtPoint
 */
function findColumnAtPoint(columns, x, y) {
    for (let i = 0; i < columns.length; i++) {
        const rect = columns[i].getBoundingClientRect();
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) return columns[i];
    }
    return null;
}


/**
 * Removes the floating touch-drag clone from the DOM.
 * @function removeTouchClone
 */
function removeTouchClone() {
    if (touchClone) {
        touchClone.remove();
        touchClone = null;
    }
}


/**
 * Strips dragging/drag-over/drag-active classes from the dragged card and columns.
 * @function clearTouchDragStyles
 */
function clearTouchDragStyles(columns) {
    touchDraggedElement.classList.remove('dragging');
    for (let i = 0; i < columns.length; i++) columns[i].classList.remove('drag-over', 'drag-active');
}


/**
 * Inserts the dragged card into the target column and persists the new status.
 * @function dropTouchTaskInColumn
 */
async function dropTouchTaskInColumn(targetColumn, clientY) {
    const container = document.getElementById(targetColumn.id + '-cards');
    const afterElement = getDragAfterElement(container, clientY);
    if (afterElement == null) container.append(touchDraggedElement);
    else afterElement.before(touchDraggedElement);
    await updateTaskStatusInDrag(touchDraggedElement, targetColumn.id);
}


/**
 * Clears the touch-drag module state after a drop or cancel.
 * @function resetTouchDragState
 */
function resetTouchDragState() {
    touchDraggedElement = null;
    touchDragActive = false;
}
