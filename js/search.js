/**
 * @fileoverview Task search and filtering utilities.
 * Filters task list and triggers re-rendering of results.
 * @version 1.0.0
 * @author Join-1325 Development Team
 */
function filterTasks(searchTerm) {
  let filteredTasks = getFilteredTasks(searchTerm);
  renderFilteredTasks(filteredTasks);
}


/**
 * Handles the getFilteredTasks workflow.
 * @function getFilteredTasks
 */
function getFilteredTasks(searchTerm) {
  let filteredTasks = [];
  let lowerSearchTerm = searchTerm.toLowerCase();

  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];
    if (taskMatchesSearchTerm(task, lowerSearchTerm)) {
      filteredTasks.push(task);
    }
  }
  return filteredTasks;
}


/**
 * Handles the taskMatchesSearchTerm workflow.
 * @function taskMatchesSearchTerm
 */
function taskMatchesSearchTerm(task, searchTerm) {
  return (
    task.title.toLowerCase().includes(searchTerm) ||
    task.description.toLowerCase().includes(searchTerm) ||
    task.category.toLowerCase().includes(searchTerm)
  );
}


/**
 * Handles the renderFilteredTasks workflow.
 * @function renderFilteredTasks
 */
function renderFilteredTasks(filteredTasks) {
  let currentTasks = tasks;
  tasks = filteredTasks;

  let columns = getKanbanColumns();
  clearAllColumns(columns);
  renderTasksInColumns();

  tasks = currentTasks;
}


// Global event handler functions for inline events
/**
 * Handles the handleSearchClick workflow.
 * @function handleSearchClick
 */
function handleSearchClick() {
  const searchInput = document.getElementById("task-search");
  if (searchInput) {
    const searchTerm = searchInput.value.trim();
    if (searchTerm === "") {
      renderAllTasks();
    } else {
      filterTasks(searchTerm);
    }
  }
}


/**
 * Handles the handleSearchKeypress workflow.
 * @function handleSearchKeypress
 */
function handleSearchKeypress(event) {
  if (event.key === "Enter") {
    const searchTerm = event.target.value.trim();
    if (searchTerm === "") {
      renderAllTasks();
    } else {
      filterTasks(searchTerm);
    }
  }
}


/**
 * Handles the handleSearchInput workflow.
 * @function handleSearchInput
 */
function handleSearchInput(event) {
  if (event.target.value.trim() === "") {
    renderAllTasks();
  }
}


/**
 * Handles the searchContact workflow.
 * @function searchContact
 */
function searchContact(mode) {
  const isEditMode = mode === 'task-edit';
  const inputId = isEditMode ? 'edit-assigned-to-input-field' : 'assigned-to-input-field';
  const listId = isEditMode ? 'edit-assigned-to-list' : 'assigned-to-list';
  const term = document.getElementById(inputId).value.toLowerCase().trim();
  filterDropdownItemsByTerm(document.getElementById(listId), term);
}


/**
 * Shows/hides assigned-to dropdown items based on whether their contact name contains the term.
 * @function filterDropdownItemsByTerm
 */
function filterDropdownItemsByTerm(list, term) {
  const items = list.children;
  for (let i = 0; i < items.length; i++) {
    const checkbox = items[i].getElementsByClassName('checkbox-masked')[0];
    if (!checkbox) continue;
    const matches = checkbox.value.toLowerCase().includes(term);
    items[i].style.display = matches ? "" : "none";
  }
}
