/**
 * @fileoverview Add-task form and assigned user management.
 * Handles dropdown population, user selection, subtasks, and form toggles.
 * @version 1.0.0
 * @author Join-1325 Development Team
 */
// Add Task Form Functionality

// Global variable to store the target column status
let targetColumnStatus = "todo";

// Global array to store selected users
let selectedUsers = [];

/**
 * Populates the assignedTo dropdown with checkboxes from contacts array
 */
function populateAssignedToDropdown(mode) {
  let dropdownList = getAssignedDropdownList(mode);

  clearDropdownList(dropdownList);
  addContactsToDropdown(dropdownList, mode);
}


function clearDropdownList(dropdownList) {
  dropdownList.innerHTML = "";
}


function addContactsToDropdown(dropdownList, mode) {
  for (let i = 0; i < contacts.length; i++) {
    let contact = contacts[i];
    let isSelected = selectedUsers.includes(contact.name);
    let itemHTML = createDropdownItemHTML(contact, i, isSelected, mode);
    dropdownList.innerHTML += itemHTML;
  }
}


function createDropdownItemHTML(contact, index, isSelected, mode) {
  let initials = getInitials(contact.name);
  let avatarColor = getAvatarColor(contact.name);
  let checkedAttribute = isSelected ? 'checked' : '';
  let modeParam = mode ? `'${mode}'` : '';
  let userId = mode === 'task-edit' ? `edit-user-${index}` : `user-${index}`;

  return `
    <div class="dropdown-item">
      <label class="d-flex dropdown-item-label custom-checkbox" for="${userId}">
        <div class="user-avatar-sm" style="background-color: ${avatarColor};">${initials}</div>
        ${contact.name}
        <input type="checkbox" class="checkbox-masked" id="${userId}" value="${contact.name}" ${checkedAttribute} onchange="toggleUserSelection('${contact.name}', event, ${modeParam})">
      </label>
    </div>
  `;
}

/**
 * Toggles the assigned to dropdown
 */
function toggleAssignedDropdown(mode, dropdownElement) {
  populateAssignedToDropdown(mode);
  let dropdownList = getAssignedDropdownList(mode);

  dropdownList.classList.toggle("d-none");
  if (dropdownElement) {
    dropdownElement.classList.toggle("open");
  }
}


function getAssignedDropdownList(mode) {
  if (mode == "task-edit") {
    return document.getElementById("edit-assigned-to-list");
  } else {
    return document.getElementById("assigned-to-list");
  }
}

/**
 * Toggles user selection in the dropdown
 * Called when checkbox state changes
 */
function toggleUserSelection(userName, event, mode) {
  event.stopPropagation();
  
  // Get checkbox directly from event target
  let checkbox = event.target;
  
  updateSelectedUsersArray(userName, checkbox.checked);
  updateDropdownPlaceholder(mode);
}

/**
 * Updates selected users array based on checkbox state
 */
function updateSelectedUsersArray(userName, isChecked) {
  let index = selectedUsers.indexOf(userName);
  if (isChecked && index === -1) {
    selectedUsers.push(userName);
  } else if (!isChecked && index > -1) {
    selectedUsers.splice(index, 1);
  }
}

/**
 * Updates the assignees container to display selected users as avatars
 */
function updateDropdownPlaceholder(mode) {
  let containerId = (mode === "task-edit") ? "edit-assignees-container" : "assignees-container";
  let container = document.getElementById(containerId);
  
  container.innerHTML = "";
  
  for (let i = 0; i < selectedUsers.length; i++) {
    let initials = getInitials(selectedUsers[i]);
    let avatarColor = getAvatarColor(selectedUsers[i]);
    
    let avatarHTML = `<div class="user-avatar-sm" style="background-color: ${avatarColor};">${initials}</div>`;
    container.innerHTML += avatarHTML;
  }
}

/**
 * Close dropdown when clicking outside
 * Should be called from a global click handler in the HTML
 */
function handleDocumentClick(event) {
  // Handle regular assigned-to dropdown
  let dropdown = document.getElementById("assigned-to");
  let dropdownList = document.getElementById("assigned-to-list");

  if (dropdown && !dropdown.contains(event.target) && dropdownList) {
    dropdownList.classList.add("d-none");
    dropdown.classList.remove("open");
  }

  // Handle edit assigned-to dropdown
  let editDropdownList = document.getElementById("edit-assigned-to-list");
  if (dropdown && !dropdown.contains(event.target) && editDropdownList) {
    editDropdownList.classList.add("d-none");
    dropdown.classList.remove("open");
  }

  let categoryDropdown = document.getElementById("category");
  let categoryList = document.getElementById("category-list");

  if (
    categoryDropdown &&
    !categoryDropdown.contains(event.target) &&
    categoryList
  ) {
    categoryList.classList.add("d-none");
    categoryDropdown.classList.remove("open");
  }
}

/**
 * Toggles the category dropdown
 */
function toggleCategoryDropdown() {
  let dropdownList = document.getElementById("category-list");
  let categoryDropdown = document.getElementById("category");

  dropdownList.classList.toggle("d-none");
  categoryDropdown.classList.toggle("open");
}

/**
 * Selects a category and updates the input
 */
function selectCategory(categoryName) {
  let input = document.getElementById("category-input");
  let hiddenInput = document.getElementById("category-hidden");
  let dropdownList = document.getElementById("category-list");
  let categoryDropdown = document.getElementById("category");

  input.value = categoryName;
  hiddenInput.value = categoryName;
  dropdownList.classList.add("d-none");
  categoryDropdown.classList.remove("open");
}

/**
 * Generates a unique task ID for guest users
 * For logged-in users, Firebase will generate the ID automatically
 * @returns {string} Unique task ID in format "task-X" for guests, or temporary ID for logged-in users
 */
function generateTaskId() {
  const isGuest = sessionStorage.getItem("isGuest") === "true";

  if (isGuest) {
    // Guest user: Generate sequential ID
    let maxId = 0;
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id.startsWith("task-")) {
        let taskIdNum = parseInt(tasks[i].id.split("-")[1]);
        if (taskIdNum > maxId) {
          maxId = taskIdNum;
        }
      }
    }
    return "task-" + (maxId + 1);
  } else {
    // Logged-in user: Return temporary ID (Firebase will replace it)
    return "temp-" + Date.now();
  }
}

/**
 * Sets the target column status for new tasks
 * @param {string} status - The status/column where task should be added (todo, in-progress, await-feedback, done)
 */
function setTargetColumn(status) {
  targetColumnStatus = status || "todo";
}


function clearForm() {
  let form = document.getElementById("task-form");
  form.reset();

  clearFormErrors();
  clearSubtasks();
  clearSelectedUsers();
  clearCategory();
}


function clearFormErrors() {
  let titleError = document.getElementById("title-error-message");
  let dateError = document.getElementById("date-error-message");
  let titleGroup = document.getElementById("title-form-group");
  let dateGroup = document.getElementById("date-form-group");

  titleError.classList.add("d-none");
  dateError.classList.add("d-none");
  titleGroup.classList.remove("error");
  dateGroup.classList.remove("error");
}


function clearSelectedUsers() {
  selectedUsers = [];
  // Checkboxes will be updated when dropdown is re-populated
  updateDropdownPlaceholder();
}


function clearCategory() {
  let categoryInput = document.getElementById("category-input");
  let categoryHidden = document.getElementById("category-hidden");

  categoryInput.value = "";
  categoryHidden.value = "";
}


function validateForm() {
  let isValid = validateTitleField();
  isValid = validateDateField() && isValid;
  return isValid;
}


function validateTitleField() {
  let title = document.getElementById("task-title");
  let titleGroup = document.getElementById("title-form-group");
  let titleError = document.getElementById("title-error-message");

  if (title.value.trim() === "") {
    titleGroup.classList.add("error");
    titleError.classList.remove("d-none");
    return false;
  } else {
    titleGroup.classList.remove("error");
    titleError.classList.add("d-none");
    return true;
  }
}


function validateDateField() {
  let date = document.getElementById("task-date");
  let dateGroup = document.getElementById("date-form-group");
  let dateError = document.getElementById("date-error-message");

  if (date.value === "") {
    dateGroup.classList.add("error");
    dateError.classList.remove("d-none");
    return false;
  } else {
    dateGroup.classList.remove("error");
    dateError.classList.add("d-none");
    return true;
  }
}


async function saveTask(event) {
  event.preventDefault();

  if (validateForm()) {
    let newTask = createTaskFromForm();
    await addNewTask(newTask);
    handleTaskSaveSuccess();
  }
}


function createTaskFromForm() {
  let taskId = generateTaskId();
  let title = document.getElementById("task-title").value.trim();
  let description = getDescriptionValue();
  let dueDate = document.getElementById("task-date").value;
  let priority = getSelectedPriority();
  let category = getSelectedCategory();
  let assignedTo = getAssignedUserNames();
  let subtasks = getFilteredSubtasks();

  return {
    id: taskId,
    title: title,
    description: description,
    category: category,
    assignedTo: assignedTo,
    priority: priority,
    status: targetColumnStatus,
    subtasks: subtasks,
    dueDate: dueDate,
  };
}


function getDescriptionValue() {
  let descriptionField = document.getElementById("description");
  return descriptionField.value.trim();
}


function getSelectedPriority() {
  let priorityRadios = document.getElementsByName("priority");
  for (let i = 0; i < priorityRadios.length; i++) {
    if (priorityRadios[i].checked) {
      return mapPriorityValue(priorityRadios[i].value);
    }
  }
}


function mapPriorityValue(value) {
  let lowerValue = value.toLowerCase();
  if (lowerValue === "high") return "urgent";
  if (lowerValue === "medium") return "medium";
  if (lowerValue === "low") return "low";
}


function getSelectedCategory() {
  let categoryHidden = document.getElementById("category-hidden");
  return categoryHidden && categoryHidden.value
    ? categoryHidden.value
    : "User Story";
}


function getAssignedUserNames() {
  let assignedTo = [];
  for (let i = 0; i < selectedUsers.length; i++) {
    assignedTo.push(selectedUsers[i]);
  }
  return assignedTo;
}


function handleTaskSaveSuccess() {
  let isOnAddTaskPage = window.location.pathname.includes("add-task.html");

  if (isOnAddTaskPage) {
    showSuccessOverlay();
    setTimeout(function () {
      window.location.href = "board.html";
    }, 1500);
  } else {
    renderAllTasks();
    showSuccessOverlay();
    setTimeout(function () {
      clearForm();
      targetColumnStatus = "todo";
      closeAllMenus();
    }, 1500);
  }
}


function showSuccessOverlay() {
  let overlay = document.getElementById("success-overlay");
  overlay.classList.remove("d-none");
}


function handleTitleBlur() {
  let titleInput = document.getElementById("task-title");
  let titleGroup = document.getElementById("title-form-group");
  let titleError = document.getElementById("title-error-message");

  if (titleInput.value.trim() === "") {
    titleGroup.classList.add("error");
    titleError.classList.remove("d-none");
  } else {
    titleGroup.classList.remove("error");
    titleError.classList.add("d-none");
  }
}


function handleDateBlur() {
  let dateInput = document.getElementById("task-date");
  let dateGroup = document.getElementById("date-form-group");
  let dateError = document.getElementById("date-error-message");

  if (dateInput.value === "") {
    dateGroup.classList.add("error");
    dateError.classList.remove("d-none");
  } else {
    dateGroup.classList.remove("error");
    dateError.classList.add("d-none");
  }
}


/**
 * Opens the add task overlay with a specific target column
 * @param {string} columnStatus - The status/column where task should be added
 */
function openAddTaskOverlay(columnStatus) {
  setTargetColumn(columnStatus);
  toggleOverlay(".add-task-menu");
}