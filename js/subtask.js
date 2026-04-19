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
  let mode = arguments[0];

  if (mode === "task-edit") {
    subtaskList = document.getElementById("edit-subtask-list");
    subtaskInput = document.getElementById("edit-add-subtask");
  }

  if (!subtaskList || !subtaskInput) {
    return;
  }

  let subtaskText = subtaskInput.value.trim();
  if (!subtaskText) {
    return;
  }
  let subtaskIndex = currentSubtasks.length;
  currentSubtasks.push({
    text: subtaskText,
    completed: false,
  });
  subtaskList.innerHTML += getSubtaskItemTemplate(subtaskIndex, subtaskText);
  subtaskInput.value = "";
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
