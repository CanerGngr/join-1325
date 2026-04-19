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
 * Initializes the Add Task page by loading existing tasks first.
 * @async
 */
async function initAddTaskPage() {
  tasks = await initializeTasks();
  populateAssignedToDropdown();
  getUserAvatar();
}


/**
 * Returns today's date in YYYY-MM-DD format for date input min attributes.
 * @returns {string}
 */
function getTodayISODate() {
  return new Date().toISOString().split("T")[0];
}


/**
 * Sets min date constraints for due date inputs so past dates cannot be selected.
 */
function setDueDateMinConstraints() {
  const today = getTodayISODate();
  const dueDateInput = document.getElementById("task-date");
  const editDueDateInput = document.getElementById("edit-task-date");

  if (dueDateInput) {
    dueDateInput.min = today;
  }

  if (editDueDateInput) {
    editDueDateInput.min = today;
  }
}


/**
 * Populates the assignedTo dropdown with checkboxes from contacts array
 */
function populateAssignedToDropdown(mode) {
  let dropdownList = getAssignedDropdownList(mode);

  clearDropdownList(dropdownList);
  addContactsToDropdown(dropdownList, mode);
}


/**
 * Handles the clearDropdownList workflow.
 * @function clearDropdownList
 */
function clearDropdownList(dropdownList) {
  dropdownList.innerHTML = "";
}


/**
 * Handles the addContactsToDropdown workflow.
 * @function addContactsToDropdown
 */
function addContactsToDropdown(dropdownList, mode) {
  for (let i = 0; i < contacts.length; i++) {
    let contact = contacts[i];
    let isSelected = selectedUsers.includes(contact.name);
    let itemHTML = createDropdownItemHTML(contact, i, isSelected, mode);
    dropdownList.innerHTML += itemHTML;
  }
}


/**
 * Handles the createDropdownItemHTML workflow.
 * @function createDropdownItemHTML
 */
function createDropdownItemHTML(contact, index, isSelected, mode) {
  let data = {
    name: contact.name,
    initials: getInitials(contact.name),
    avatarColor: getAvatarColor(contact.name),
    checkedAttribute: isSelected ? 'checked' : '',
    modeParam: mode ? `'${mode}'` : '',
    userId: mode === 'task-edit' ? `edit-user-${index}` : `user-${index}`,
  };
  return getDropdownItemTemplate(data);
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


/**
 * Handles the getAssignedDropdownList workflow.
 * @function getAssignedDropdownList
 */
function getAssignedDropdownList(mode) {
  if (mode === "task-edit") {
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
  const containerId = (mode === "task-edit") ? "edit-assignees-container" : "assignees-container";
  const container = document.getElementById(containerId);
  const maxVisibleAssignees = 4;
  const visibleAssignees = selectedUsers.slice(0, maxVisibleAssignees);
  const hiddenCount = selectedUsers.length - visibleAssignees.length;

  container.innerHTML = "";
  renderAssigneeAvatars(container, visibleAssignees);
  if (hiddenCount > 0) container.innerHTML += getAssigneeOverflowTemplate(hiddenCount);
}


/**
 * Appends avatar chips for the given users to the container.
 * @function renderAssigneeAvatars
 */
function renderAssigneeAvatars(container, users) {
  for (let i = 0; i < users.length; i++) {
    container.innerHTML += getAssigneeAvatarTemplate(users[i]);
  }
}


/**
 * Close dropdown when clicking outside
 * Should be called from a global click handler in the HTML
 */
function handleDocumentClick(event) {
  const editList = document.getElementById("edit-assigned-to-list");
  closeDropdownIfOutside(event, document.getElementById("assigned-to"), document.getElementById("assigned-to-list"));
  closeDropdownIfOutside(event, editList?.closest(".custom-dropdown"), editList);
  closeDropdownIfOutside(event, document.getElementById("category"), document.getElementById("category-list"));
}


/**
 * Closes a dropdown when the click target is outside of it.
 * @function closeDropdownIfOutside
 */
function closeDropdownIfOutside(event, dropdown, list) {
  if (dropdown && !dropdown.contains(event.target) && list) {
    list.classList.add("d-none");
    dropdown.classList.remove("open");
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
  let categoryFormGroup = document.getElementById("category-form-group");
  if (categoryFormGroup) categoryFormGroup.classList.remove("error");
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


/**
 * Handles the clearForm workflow.
 * @function clearForm
 */
function clearForm() {
  let form = document.getElementById("task-form");
  form.reset();

  clearTaskFormErrors(false);
  clearSubtasks();
  clearSelectedUsers();
  clearCategory();
}


/**
 * Handles the clearSelectedUsers workflow.
 * @function clearSelectedUsers
 */
function clearSelectedUsers() {
  selectedUsers = [];
  // Checkboxes will be updated when dropdown is re-populated
  updateDropdownPlaceholder();
}


/**
 * Handles the clearCategory workflow.
 * @function clearCategory
 */
function clearCategory() {
  let categoryInput = document.getElementById("category-input");
  let categoryHidden = document.getElementById("category-hidden");

  categoryInput.value = "";
  categoryHidden.value = "";
}


/**
 * Handles the saveTask workflow.
 * @function saveTask
 */
async function saveTask(event) {
  event.preventDefault();

  if (validateTaskForm(false)) {
    let newTask = createTaskFromForm();
    await addNewTask(newTask);
    handleTaskSaveSuccess();
  }
}


/**
 * Handles the createTaskFromForm workflow.
 * @function createTaskFromForm
 */
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


/**
 * Handles the getDescriptionValue workflow.
 * @function getDescriptionValue
 */
function getDescriptionValue() {
  let descriptionField = document.getElementById("description");
  return descriptionField.value.trim();
}


/**
 * Handles the getSelectedPriority workflow.
 * @function getSelectedPriority
 */
function getSelectedPriority() {
  let priorityRadios = document.getElementsByName("priority");
  for (let i = 0; i < priorityRadios.length; i++) {
    if (priorityRadios[i].checked) {
      return mapPriorityValue(priorityRadios[i].value);
    }
  }
}


/**
 * Handles the mapPriorityValue workflow.
 * @function mapPriorityValue
 */
function mapPriorityValue(value) {
  let lowerValue = value.toLowerCase();
  if (lowerValue === "urgent") return "urgent";
  if (lowerValue === "medium") return "medium";
  if (lowerValue === "low") return "low";
}


/**
 * Handles the getSelectedCategory workflow.
 * @function getSelectedCategory
 */
function getSelectedCategory() {
  let categoryHidden = document.getElementById("category-hidden");
  return categoryHidden ? categoryHidden.value : "";
}


/**
 * Handles the getAssignedUserNames workflow.
 * @function getAssignedUserNames
 */
function getAssignedUserNames() {
  let assignedTo = [];
  for (let i = 0; i < selectedUsers.length; i++) {
    assignedTo.push(selectedUsers[i]);
  }
  return assignedTo;
}


/**
 * Handles the handleTaskSaveSuccess workflow.
 * @function handleTaskSaveSuccess
 */
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


/**
 * Handles the showSuccessOverlay workflow.
 * @function showSuccessOverlay
 */
function showSuccessOverlay() {
  let overlay = document.getElementById("success-overlay");
  overlay.classList.remove("d-none");
  setTimeout(function () {
    overlay.classList.add("d-none");
  }, 1500);
}


/**
 * Opens the add task overlay with a specific target column
 * @param {string} columnStatus - The status/column where task should be added
 */
function openAddTaskOverlay(columnStatus) {
  setTargetColumn(columnStatus);
  setDueDateMinConstraints();
  toggleOverlay(".add-task-menu");
}


setDueDateMinConstraints();
