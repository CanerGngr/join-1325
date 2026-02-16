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


function taskMatchesSearchTerm(task, searchTerm) {
  return (
    task.title.toLowerCase().includes(searchTerm) ||
    task.description.toLowerCase().includes(searchTerm) ||
    task.category.toLowerCase().includes(searchTerm)
  );
}


function renderFilteredTasks(filteredTasks) {
  let currentTasks = tasks;
  tasks = filteredTasks;
  renderAllTasks();
  tasks = currentTasks;
}


// Global event handler functions for inline events
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


function handleSearchInput(event) {
  if (event.target.value.trim() === "") {
    renderAllTasks();
  }
}


function searchContact(mode) {
  const searchInput = mode === 'task-edit'
    ? document.getElementById('edit-assigned-to-input-field')
    : document.getElementById('assigned-to-input-field');
  const searchTerm = searchInput.value.toLowerCase().trim();
  
  // Filter contacts array based on search term
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm)
  );
  
  // Get dropdown container and iterate through children
  const dropdownList = mode === 'task-edit'
    ? document.getElementById('edit-assigned-to-list')
    : document.getElementById('assigned-to-list');
  const dropdownItems = dropdownList.children;
  
  for (let i = 0; i < dropdownItems.length; i++) {
    const dropdownItem = dropdownItems[i];
    // Find checkbox by class name
    const checkboxes = dropdownItem.getElementsByClassName('checkbox-masked');
    const checkbox = checkboxes.length > 0 ? checkboxes[0] : null;
    
    if (checkbox) {
      const contactName = checkbox.value;
      // Show or hide based on whether the contact is in filtered results
      const isVisible = filteredContacts.some(contact => contact.name === contactName);
      dropdownItem.style.display = isVisible ? "" : "none";
    }
  }
}