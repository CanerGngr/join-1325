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
    const touch  = event.touches[0];
    const rect   = element.getBoundingClientRect();

    touchStartX     = touch.clientX;
    touchStartY     = touch.clientY;
    touchOffsetX    = touch.clientX - rect.left;
    touchOffsetY    = touch.clientY - rect.top;
    touchDragActive = false;

    touchLongPressTimer = setTimeout(() => {
        touchDraggedElement = element;
        touchDragActive     = true;
        element.classList.add('dragging');

        touchClone = element.cloneNode(true);
        touchClone.classList.add('touch-drag-clone');
        touchClone.style.width = rect.width + 'px';
        touchClone.style.left  = (touch.clientX - touchOffsetX) + 'px';
        touchClone.style.top   = (touch.clientY - touchOffsetY) + 'px';
        document.body.appendChild(touchClone);
    }, LONG_PRESS_MS);
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
        const dx = Math.abs(touch.clientX - touchStartX);
        const dy = Math.abs(touch.clientY - touchStartY);
        if (dx > 8 || dy > 8) {
            clearTimeout(touchLongPressTimer);
            touchLongPressTimer = null;
        }
        return;
    }

    event.preventDefault();

    touchClone.style.left = (touch.clientX - touchOffsetX) + 'px';
    touchClone.style.top  = (touch.clientY - touchOffsetY) + 'px';

    const columns = [
        document.getElementById('todo'),
        document.getElementById('in-progress'),
        document.getElementById('await-feedback'),
        document.getElementById('done')
    ];

    columns.forEach(col => col.classList.remove('drag-over'));

    touchClone.style.display = 'none';
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    touchClone.style.display = '';

    if (!elementBelow) return;
    const targetColumn = elementBelow.closest('.kanban-column');
    if (targetColumn) {
        targetColumn.classList.add('drag-over');
    }
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

    if (!touchDragActive || !touchDraggedElement) {
        touchDragActive = false;
        return;
    }

    const touch = event.changedTouches[0];

    if (touchClone) {
        touchClone.remove();
        touchClone = null;
    }

    touchDraggedElement.classList.remove('dragging');

    touchDraggedElement.style.display = 'none';
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    touchDraggedElement.style.display = '';

    const columns = [
        document.getElementById('todo'),
        document.getElementById('in-progress'),
        document.getElementById('await-feedback'),
        document.getElementById('done')
    ];
    columns.forEach(col => col.classList.remove('drag-over', 'drag-active'));

    let targetColumn = null;
    if (elementBelow) {
        targetColumn = elementBelow.closest('.kanban-column');
    }

    if (targetColumn) {
        const targetContainer = document.getElementById(targetColumn.id + '-cards');
        const afterElement    = getDragAfterElement(targetContainer, touch.clientY);
        if (afterElement == null) {
            targetContainer.append(touchDraggedElement);
        } else {
            afterElement.before(touchDraggedElement);
        }
        await updateTaskStatusInDrag(touchDraggedElement, targetColumn.id);
    }

    touchDraggedElement = null;
    touchDragActive     = false;
}
