/**
 * @fileoverview Edit-task overlay and update helpers.
 * Manages assigned users, priority selection, subtasks, and form templates.
 * @version 1.0.0
 * @author Join-1325 Development Team
 */
// Edit Task Functionality

/**
 * Opens the edit task form with the task data
 * @param {string} taskId - ID of the task to edit
 */
function editTask(taskId) {
  const task = findTaskById(taskId);
  document.getElementById("details-overlay").innerHTML = getEditTaskTemplate(task);
  setDueDateMinConstraints();
  initEditTaskState(task);
}


/**
 * Initializes the shared edit-task state (assignees, subtasks, priority).
 * @function initEditTaskState
 */
function initEditTaskState(task) {
  selectedUsers = Array.isArray(task.assignedTo) ? [...task.assignedTo] : [];
  currentSubtasks = Array.isArray(task.subtasks) ? [...task.subtasks] : [];
  setPriorityForEdit(task.priority);
}


/**
 * Sets the priority radio button in edit mode
 * @param {string} priority - Priority value (urgent, medium, low)
 */
function setPriorityForEdit(priority) {
  const priorityMap = {
    'urgent': 'edit-urgent-priority',
    'medium': 'edit-medium-priority',
    'low': 'edit-low-priority'
  };
  
  const radioId = priorityMap[priority?.toLowerCase()];
  const radioButton = document.getElementById(radioId);
    radioButton.checked = true;
}


/**
 * Handles the generateAssignedUsersEditHTML workflow.
 * @function generateAssignedUsersEditHTML
 */
function generateAssignedUsersEditHTML(assignedToArray) {
  const max = 4;
  const visible = assignedToArray.slice(0, max);
  const hidden = assignedToArray.length - visible.length;
  let html = "";
  for (let i = 0; i < visible.length; i++) {
    html += createEditUserAvatarHTML(visible[i]);
  }
  if (hidden > 0) html += getAssigneeOverflowTemplate(hidden);
  return html;
}


/** * Retrieves the selected priority value from the edit form
 * @returns {string} - The selected priority value ("urgent", "medium", "low")
 **/
function getEditPriorityValue() {
  const priorityRadios = document.getElementsByName("edit-priority");
  for (let i = 0; i < priorityRadios.length; i++) {
    if (priorityRadios[i].checked) {
      priority = mapPriorityValue(priorityRadios[i].value);
      return priority;
    }
  }
}

/**
 * Maps the priority value from the form to the expected format
 * @param {string} value - The value from the radio button (e.g., "high", "Medium", "Low")
 * @returns {string} - Mapped priority value ("urgent", "medium", "low")
 **/
function getAssignedUsersFormData() {
  let assignedTo = [];
  for (let i = 0; i < selectedUsers.length; i++) {
    assignedTo.push(selectedUsers[i]);
  }
  return assignedTo;
}

/**
 * Collects and returns the form data for the edited task
 * @returns {Object} - Updated task object with title, description, due date, priority, assigned users, and subtasks
 **/
function getEditTaskFormData() {
  const title = document.getElementById("edit-task-title").value.trim();
  const description = document.getElementById("task-description").value.trim();
  const dueDate = document.getElementById("edit-task-date").value;
  
 // Create updated task object
  return updatedTask = {
    title: title,
    description: description,
    dueDate: dueDate,
    priority: getEditPriorityValue(),
    assignedTo: getAssignedUsersFormData(),
    subtasks: getFilteredSubtasks()
  };
}


/**
 * Submits the edited task
 * @param {Event} event - Form submit event
 * @param {string} taskId - ID of the task being edited
 */
async function submitEditTask(event, taskId) {
  event.preventDefault();
  if (!validateTaskForm(true)) {
    return;
  }
  
  // Update the task
  await updateTask(taskId, getEditTaskFormData());
  
  // Refresh the board
  renderAllTasks();

  // Close the overlay
  toggleOverlay('#details-overlay');

  // Show success notification
  showEditSuccessOverlay();

  // Reset arrays
  selectedUsers = [];
  currentSubtasks = [];
}

/**
 * Shows a success overlay when a task is edited.
 * @function showEditSuccessOverlay
 */
function showEditSuccessOverlay() {
  let overlay = document.getElementById("edit-success-overlay");
  if (!overlay) return;
  overlay.classList.remove("d-none");
  setTimeout(function () {
    overlay.classList.add("d-none");
  }, 1500);
}
