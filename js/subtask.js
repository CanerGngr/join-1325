/**
 * @fileoverview Subtask management helpers.
 * Add, edit, remove, and render subtasks attached to tasks.
 * @version 1.0.0
 * @author Join-1325 Development Team
 */
// Subtask Management Functionality

// Global array to store subtasks
let currentSubtasks = [];

/**
 * Adds a new subtask to the list
 */
function addSubtask() {
  let subtaskList = document.getElementById("subtask-list");
  let subtaskInput = document.getElementById("add-subtask");
  let subtaskText = subtaskInput.value.trim();
  let subtaskIndex = currentSubtasks.length;
  currentSubtasks.push({
    text: subtaskText,
    completed: false,
  });
  subtaskList.innerHTML += getSubtaskItemTemplate(subtaskIndex, subtaskText);
  subtaskInput.value = "";
}


/**
 * Returns HTML template for a subtask item
 * @param {number} index - Index of the subtask
 * @param {string} text - Text content of the subtask
 * @returns {string} HTML string for the subtask item
 */
function getSubtaskItemTemplate(index, text) {
  return `
      <li class="subtask-item" data-subtask-index="${index}" id="subtask-item-${index}">
        <span class="subtask-text">${text}</span>
        <div class="form-btn-group">
          <button type="button" class="form-btn-round" onclick="editSubtask(${index})">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z" fill="#4589FF"/>
            </svg>
          </button>
          <div class="vertical-divider"></div>
          <button type="button" class="form-btn-round" onclick="removeSubtask(${index}, this.closest('.subtask-item'))">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6C4.71667 6 4.47917 5.90417 4.2875 5.7125C4.09583 5.52083 4 5.28333 4 5C4 4.71667 4.09583 4.47917 4.2875 4.2875C4.47917 4.09583 4.71667 4 5 4H9C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4H19C19.2833 4 19.5208 4.09583 19.7125 4.2875C19.9042 4.47917 20 4.71667 20 5C20 5.28333 19.9042 5.52083 19.7125 5.7125C19.5208 5.90417 19.2833 6 19 6V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM7 6V19H17V6H7ZM9 16C9 16.2833 9.09583 16.5208 9.2875 16.7125C9.47917 16.9042 9.71667 17 10 17C10.2833 17 10.5208 16.9042 10.7125 16.7125C10.9042 16.5208 11 16.2833 11 16V9C11 8.71667 10.9042 8.47917 10.7125 8.2875C10.5208 8.09583 10.2833 8 10 8C9.71667 8 9.47917 8.09583 9.2875 8.2875C9.09583 8.47917 9 8.71667 9 9V16ZM13 16C13 16.2833 13.0958 16.5208 13.2875 16.7125C13.4792 16.9042 13.7167 17 14 17C14.2833 17 14.5208 16.9042 14.7125 16.7125C14.9042 16.5208 15 16.2833 15 16V9C15 8.71667 14.9042 8.47917 14.7125 8.2875C14.5208 8.09583 14.2833 8 14 8C13.7167 8 13.4792 8.09583 13.2875 8.2875C13.0958 8.47917 13 8.71667 13 9V16Z" fill="#4589FF"/>
            </svg>
          </button>
        </div>
      </li>
    `;
}


/**
 * Removes a subtask from the array and DOM
 * @param {number} index - Index of the subtask in currentSubtasks array
 * @param {HTMLElement} element - The list item element to remove
 */
function removeSubtask(index, element) {
  // Remove from array by setting to null (to keep indices stable)
  currentSubtasks[index] = null;
  // Remove from DOM
  element.remove();
}

function getSubtaskEditTemplate(index, text) {
  return `
    <div class="subtask-edit-container" id="subtask-edit-${index}">
      <div class="subtask-input-container">
        <input
        type="text"
        id="subtask-edit-input-${index}"
        class="subtask-edit-input container-with-form-btn-group form-input"
        value="${text}"
        />
        <div class="form-btn-group">
          <button type="button" class="form-btn-round" onclick="saveSubtaskEdit(${index})">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.55002 15.15L18.025 6.675C18.225 6.475 18.4625 6.375 18.7375 6.375C19.0125 6.375 19.25 6.475 19.45 6.675C19.65 6.875 19.75 7.1125 19.75 7.3875C19.75 7.6625 19.65 7.9 19.45 8.1L10.25 17.3C10.05 17.5 9.81669 17.6 9.55002 17.6C9.28336 17.6 9.05002 17.5 8.85002 17.3L4.55002 13C4.35002 12.8 4.25419 12.5625 4.26252 12.2875C4.27086 12.0125 4.37502 11.775 4.57502 11.575C4.77502 11.375 5.01252 11.275 5.28752 11.275C5.56252 11.275 5.80002 11.375 6.00002 11.575L9.55002 15.15Z" fill="#4589FF"/>
            </svg>
          </button>
          <div class="vertical-divider"></div>
          <button type="button" class="form-btn-round" onclick="cancelSubtaskEdit(${index})">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 13.4L7.09999 18.3C6.91665 18.4834 6.68332 18.575 6.39999 18.575C6.11665 18.575 5.88332 18.4834 5.69999 18.3C5.51665 18.1167 5.42499 17.8834 5.42499 17.6C5.42499 17.3167 5.51665 17.0834 5.69999 16.9L10.6 12L5.69999 7.10005C5.51665 6.91672 5.42499 6.68338 5.42499 6.40005C5.42499 6.11672 5.51665 5.88338 5.69999 5.70005C5.88332 5.51672 6.11665 5.42505 6.39999 5.42505C6.68332 5.42505 6.91665 5.51672 7.09999 5.70005L12 10.6L16.9 5.70005C17.0833 5.51672 17.3167 5.42505 17.6 5.42505C17.8833 5.42505 18.1167 5.51672 18.3 5.70005C18.4833 5.88338 18.575 6.11672 18.575 6.40005C18.575 6.68338 18.4833 6.91672 18.3 7.10005L13.4 12L18.3 16.9C18.4833 17.0834 18.575 17.3167 18.575 17.6C18.575 17.8834 18.4833 18.1167 18.3 18.3C18.1167 18.4834 17.8833 18.575 17.6 18.575C17.3167 18.575 17.0833 18.4834 16.9 18.3L12 13.4Z" fill="#4589FF"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;
}


/**
 * Edits an existing subtask
 * Opens an input field above the subtask item for inline editing
 * @param {number} index - Index of the subtask to edit
 */
function editSubtask(index) {
  let subtaskItem = document.getElementById(`subtask-item-${index}`);
  // Get current subtask text
  let currentText = currentSubtasks[index].text;

  // Create edit input container
  subtaskItem.insertAdjacentHTML('afterend', getSubtaskEditTemplate(index, currentText));

  // Hide the original subtask item
  subtaskItem.style.display = 'none';

  // Focus the input field
  let input = document.getElementById(`subtask-edit-input-${index}`);
  input.focus();
  input.select();
}


/**
 * Saves the edited subtask text
 * @param {number} index - Index of the subtask being edited
 */
function saveSubtaskEdit(index) {
  let input = document.getElementById(`subtask-edit-input-${index}`);
  let subtaskItem = document.getElementById(`subtask-item-${index}`);
  let textSpan = subtaskItem.getElementsByClassName('subtask-text')[0];

  if (!input) return;

  let newText = input.value.trim();

  if (newText.length > 0) {
    // Update the subtask text
    currentSubtasks[index].text = newText;

    // Update the display
    textSpan.textContent = newText;
  }

  // Remove edit container and show original item
  cancelSubtaskEdit(index);
}


/**
 * Cancels the subtask edit and restores the original view
 * @param {number} index - Index of the subtask being edited
 */
function cancelSubtaskEdit(index) {
  let editContainer = document.getElementById(`subtask-edit-${index}`);
  let subtaskItem = document.getElementById(`subtask-item-${index}`);
  editContainer.remove();
  subtaskItem.style.display = '';
}


/**
 * Clears all subtasks from the list and array
 */
function clearSubtasks() {
  let subtaskList = document.getElementById("subtask-list");
  subtaskList.innerHTML = "";
  currentSubtasks = [];
}


/**
 * Returns filtered subtasks (removes null entries)
 * @returns {Array} Array of valid subtask objects
 */
function getFilteredSubtasks() {
  return currentSubtasks.filter(function (subtask) {
    return subtask !== null;
  });
}


/**
 * Calculates subtask progress statistics
 * @param {Array} subtasks - Array of subtask objects
 * @returns {Object} Object containing subtaskProgress, totalSubtasks, and progressInPercent
 */
function calculateSubtaskProgress(subtasks) {
  if (!subtasks || !Array.isArray(subtasks)) {
    return { subtaskProgress: "", totalSubtasks: 0, progressInPercent: 0 };
  }

  let completedSubtasks = 0;
  for (let i = 0; i < subtasks.length; i++) {
    if (subtasks[i] && subtasks[i].completed) {
      completedSubtasks++;
    }
  }

  let totalSubtasks = subtasks.length;
  let subtaskProgress =
    totalSubtasks > 0
      ? completedSubtasks + "/" + totalSubtasks + "Subtasks"
      : "";
  let progressInPercent =
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  return { subtaskProgress, totalSubtasks, progressInPercent };
}


/**
 * Generates HTML for displaying subtasks in task details
 * @param {string} taskId - ID of the task
 * @param {Array} subtasks - Array of subtask objects
 * @returns {string} HTML string for subtasks list
 */
function generateSubtasksHTML(taskId, subtasks) {
  if (!subtasks || !Array.isArray(subtasks)) {
    return "";
  }

  let html = "";
  for (let i = 0; i < subtasks.length; i++) {
    let subtask = subtasks[i];
    let completedClass = subtask.completed ? "completed" : "";
    html += `<div class="${completedClass} subtask"><input type="checkbox" class="checkbox-masked" id="subtask-${i}" onchange="toggleSubtaskStatus('${taskId}', this.id)" ${subtask.completed ? "checked" : ""}>${subtask.text}</div>`;
  }
  return html;
}


/**
 * Toggles the completion status of a subtask
 * @param {string} taskId - ID of the task containing the subtask
 * @param {string} checkboxId - ID of the checkbox element
 */
async function toggleSubtaskStatus(taskId, checkboxId) {
  const task = findTaskById(taskId);
  const index = parseInt(checkboxId.split("-")[1], 10);
  task.subtasks[index].completed = !task.subtasks[index].completed;
  await updateTask(taskId, { subtasks: task.subtasks });
  renderAllTasks();
}
