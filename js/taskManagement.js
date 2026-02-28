/**
 * @fileoverview Task lifecycle and data management.
 * Initializes, loads, persists and renders tasks for the Kanban board.
 * @version 1.0.0
 * @author Join-1325 Development Team
 */
/**
 * Initializes tasks array
 * Loads from Firebase for logged-in users or SessionStorage for guests
 * @async
 * @returns {Promise<Array>} Array of tasks
 */
async function initializeTasks() {
  const isGuest = sessionStorage.getItem("isGuest") === "true";
  
  if (isGuest) {
    // Guest user: Load from SessionStorage or use default tasks
    const storedTasks = loadTasksFromSession();
    return storedTasks || getDefaultTasks();
  } else {
    // Logged-in user: Load from Firebase
      const firebaseTasks = await loadTasksFromFirebase();
      return firebaseTasks.length > 0 ? firebaseTasks : getDefaultTasks();
  }
}


/**
 * Returns default tasks for initial setup
 * @returns {Array} Array of default tasks
 */
function getDefaultTasks() {
  return [
    {
      id: "task-1",
      title: "Kochwelt Page & Recipe Recommender",
      description: "Build start page with recipe recommendation.",
      category: "User Story",
      assignedTo: ["John Doe", "Jane Smith"],
      priority: "urgent",
      status: "todo",
      subtasks: [
        { text: "Implement Recipe Recommender", completed: false },
        { text: "Start Page Layout", completed: true }
      ],
      dueDate: "2024-05-10"
    },
    {
      id: "task-2",
      title: "HTML Base Template Creation",
      description: "Create reusable HTML base templates for all pages.",
      category: "User Story",
      assignedTo: ["Alice Johnson"],
      priority: "medium",
      status: "todo",
      subtasks: [
        { text: "Header Template", completed: false },
        { text: "Footer Template", completed: false },
        { text: "Navigation Template", completed: true }
      ],
      dueDate: "2024-05-12"
    },
    {
      id: "task-3",
      title: "CSS Architecture Planning",
      description: "Plan and structure CSS architecture for the project.",
      category: "User Story",
      assignedTo: ["Cathy Brown", "David Clark", "Liam King"],
      priority: "low",
      status: "in-progress",
      subtasks: [
        { text: "Define CSS Variables", completed: true },
        { text: "Create Component Structure", completed: false }
      ],
      dueDate: "2024-05-15"
    },
    {
      id: "task-4",
      title: "JavaScript Functions",
      description: "Implement core JavaScript functionality.",
      category: "Technical Task",
      assignedTo: ["Nathan Moore"],
      priority: "urgent",
      status: "in-progress",
      subtasks: [
        { text: "Event Handlers", completed: false },
        { text: "Data Management", completed: false }
      ],
      dueDate: "2024-05-08"
    },
    {
      id: "task-5",
      title: "Daily Kanban Board",
      description: "Create a functional Kanban board for task management.",
      category: "User Story",
      assignedTo: ["Paul Owens", "Rachel Quinn"],
      priority: "medium",
      status: "await-feedback",
      subtasks: [
        { text: "Drag & Drop Functionality", completed: true },
        { text: "Task Card Design", completed: true },
        { text: "Status Management", completed: false }
      ],
      dueDate: "2024-05-20"
    },
    {
      id: "task-6",
      title: "Contact Management System",
      description: "Develop a comprehensive contact management system.",
      category: "User Story",
      assignedTo: ["Tina Scott"],
      priority: "low",
      status: "done",
      subtasks: [
        { text: "Contact List View", completed: true },
        { text: "Contact Form", completed: true }
      ],
      dueDate: "2024-05-05"
    },
    {
      id: "task-7",
      title: "Database Integration",
      description: "Set up database connection and data persistence.",
      category: "Technical Task",
      assignedTo: ["Quincy Price", "Samuel Reed"],
      priority: "medium",
      status: "done",
      subtasks: [
        { text: "Database Schema", completed: true },
        { text: "API Endpoints", completed: true },
        { text: "Data Validation", completed: true }
      ],
      dueDate: "2024-05-03"
    }
  ];
}

// Initialize tasks - will be set by initializeTasks()
let tasks = [];

// Priority icons mapping
const priorityIcons = {
  urgent: "/assets/icon/taskManagement/urgent.svg",
  medium: "/assets/icon/taskManagement/medium.svg",
  low: "/assets/icon/taskManagement/low.svg",
};

// Priority labels mapping
const priorityLabels = {
  urgent: "High Priority",
  medium: "Medium Priority",
  low: "Low Priority",
};

// Kategorie-zu-CSS-ID Mapping
const categoryToId = {
  "User Story": "user-story",
  "Technical Task": "technical-task",
};

/**
 * Handles the generateTaskCardHTML workflow.
 * @function generateTaskCardHTML
 */
function generateTaskCardHTML(task) {
  let assignedUsersHTML = generateAssignedUsersHTML(task.assignedTo || []);
  let categoryId = categoryToId[task.category] || "user-story";
  let priorityIcon = priorityIcons[task.priority] || priorityIcons["medium"];
  let priorityLabel = priorityLabels[task.priority] || priorityLabels["medium"];
  let subtaskData = calculateSubtaskProgress(task.subtasks || []);

  return getTaskCardTemplate(
    task,
    assignedUsersHTML,
    categoryId,
    priorityIcon,
    priorityLabel,
    subtaskData
  );
}


/**
 * Handles the generateAssignedUsersHTML workflow.
 * @function generateAssignedUsersHTML
 */
function generateAssignedUsersHTML(assignedToArray) {
  let html = "";
  for (let i = 0; i < assignedToArray.length; i++) {
    let initials = getInitials(assignedToArray[i]);
    let userColor = getAvatarColor(assignedToArray[i]);
    html += `<div class="user-avatar-sm" style="background-color: ${userColor};">${initials}</div>`;
  }
  return html;
}

/**
 * Handles the getTaskCardTemplate workflow.
 * @function getTaskCardTemplate
 */
function getTaskCardTemplate(
  task,
  assignedUsersHTML,
  categoryId,
  priorityIcon,
  priorityLabel,
  subtaskData
) {
  let { subtaskProgress, totalSubtasks, progressInPercent } = subtaskData;

  return `
    <div class="task-card" draggable="true" data-task-id="${task.id || ''}" 
         ondragstart="handleDragStart(event, this)" 
         ondragend="handleDragEnd(this)"
         onclick="showTaskDetails('${task.id || ''}')">
      <div id="${categoryId}" class="ticket-label">${task.category || 'User Story'}</div>
      <div class="task-title">${task.title || 'Untitled Task'}</div>
      <div class="task-description">${task.description || ''}</div>
      <div class="subtask-container">
        
        ${
          totalSubtasks > 0
            ? `
              <div class="progress-container d-flex">
                <div class="progress-bar" style="width: ${progressInPercent}%;"></div>
              </div>
              <div class="task-subtasks">${subtaskProgress}</div>
              `
            : ""
        }
      </div>
      <div class="task-footer d-flex">
        <div class="task-users">
          ${assignedUsersHTML}
        </div>
        <div class="task-priority">
          <img src="${priorityIcon}" alt="${priorityLabel}" class="priority-icon">
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders all tasks on the Kanban board
 * Initializes tasks from Firebase or SessionStorage on first call
 * @async
 */
async function renderAllTasks() {
  // Initialize tasks if array is empty
  if (tasks.length === 0) {
    tasks = await initializeTasks();
  }
  populateAssignedToDropdown();

  let columns = getKanbanColumns();
  clearAllColumns(columns);
  renderTasksInColumns();
}


/**
 * Handles the getKanbanColumns workflow.
 * @function getKanbanColumns
 */
function getKanbanColumns() {
  return {
    todo: document.getElementById("todo"),
    inProgress: document.getElementById("in-progress"),
    awaitFeedback: document.getElementById("await-feedback"),
    done: document.getElementById("done"),
  };
}


/**
 * Handles the clearAllColumns workflow.
 * @function clearAllColumns
 */
function clearAllColumns(columns) {
  clearColumnTaskCards(columns.todo);
  clearColumnTaskCards(columns.inProgress);
  clearColumnTaskCards(columns.awaitFeedback);
  clearColumnTaskCards(columns.done);
}


/**
 * Handles the renderTasksInColumns workflow.
 * @function renderTasksInColumns
 */
function renderTasksInColumns() {
  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];
    const containerId = task.status + "-cards";
    const container = document.getElementById(containerId);
    container.insertAdjacentHTML("beforeend", generateTaskCardHTML(task));
  }
}


/**
 * Handles the clearColumnTaskCards workflow.
 * @function clearColumnTaskCards
 */
function clearColumnTaskCards(column) {
  const container = document.getElementById(column.id + "-cards");
  container.innerHTML = "";
}


/**
 * Handles the findTaskById workflow.
 * @function findTaskById
 */
function findTaskById(taskId) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === taskId) {
      return tasks[i];
    }
  }
  return null;
}

/**
 * Updates task status in Firebase (for logged-in users) or SessionStorage (for guests)
 * Updates at boards/{userId}/tasks/{taskId}
 * @async
 * @param {string} taskId - The ID of the task to update
 * @param {string} newStatus - The new status value
 */
async function updateTaskStatus(taskId, newStatus) {
  const isGuest = sessionStorage.getItem("isGuest") === "true";
  const task = findTaskById(taskId);
  
  if (task) {
    task.status = newStatus;
    
    if (isGuest) {
      // Guest user: Update SessionStorage only
      saveTasksToSession();
    } else {
      // Logged-in user: Update Firebase
      const userId = sessionStorage.getItem("userId");
      if (!userId) {
        console.error("No userId found in session");
        return;
      }
      
      try {
        await firebase.database().ref(`boards/${userId}/tasks/${taskId}`).update({ status: newStatus });
      } catch (error) {
        console.error("Error updating task status:", error);
      }
    }
  }
}

/**
 * Deletes a task from Firebase (for logged-in users) or SessionStorage (for guests)
 * Deletes from boards/{userId}/tasks/{taskId}
 * @async
 * @param {string} taskId - The ID of the task to delete
 */
async function deleteTask(taskId) {
  const isGuest = sessionStorage.getItem("isGuest") === "true";
  
  let taskIndex = -1;
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === taskId) {
      taskIndex = i;
      break;
    }
  }
  
  if (taskIndex > -1) {
    if (isGuest) {
      // Guest user: Delete from SessionStorage only
      tasks.splice(taskIndex, 1);
      saveTasksToSession();
    } else {
      // Logged-in user: Delete from Firebase
      const userId = sessionStorage.getItem("userId");
      if (!userId) {
        console.error("No userId found in session");
        return;
      }
      
      try {
        await firebase.database().ref(`boards/${userId}/tasks/${taskId}`).remove();
        tasks.splice(taskIndex, 1);
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
    renderAllTasks();
  }
}


/**
 * Handles the showTaskDetails workflow.
 * @function showTaskDetails
 */
function showTaskDetails(taskId) {
  const task = findTaskById(taskId);
  const detailsOverlay = document.getElementById("details-overlay");
  detailsOverlay.innerHTML = getTaskDetailsTemplate(task);
  toggleOverlay("#details-overlay");
}


/**
 * Handles the getTaskDetailsTemplate workflow.
 * @function getTaskDetailsTemplate
 */
function getTaskDetailsTemplate(task) {
  if (!task) {
    return "<p>Task not found</p>";
  }
  
  let categoryId = categoryToId[task.category] || "user-story";
  let priorityIcon = priorityIcons[task.priority] || priorityIcons["medium"];
  let priorityLabel = priorityLabels[task.priority] || priorityLabels["medium"];
  let subtasksHTML = generateSubtasksHTML(task.id ,task.subtasks || []);
  let assignedUsersHTML = generateAssignedUsersDetailsHTML(task.assignedTo || []);

  return createDetailsTemplate(
    task,
    categoryId,
    subtasksHTML,
    assignedUsersHTML,
    priorityIcon,
    priorityLabel
  );
}



/**
 * Handles the generateAssignedUsersDetailsHTML workflow.
 * @function generateAssignedUsersDetailsHTML
 */
function generateAssignedUsersDetailsHTML(assignedToArray) {
  let html = "";
  for (let i = 0; i < assignedToArray.length; i++) {
    html += createUserItemHTML(assignedToArray[i]);
  }
  return html;
}

/**
 * Handles the createUserItemHTML workflow.
 * @function createUserItemHTML
 */
function createUserItemHTML(fullName) {
  let initials = getInitials(fullName);
  let avatarColor = getAvatarColor(fullName);

  return `
    <div class="user-item">
      <div class="user-avatar-sm" style="background-color: ${avatarColor};">${initials}</div>
      <span class="user-name">${fullName}</span>
    </div>
  `;
}


/**
 * Handles the createDetailsTemplate workflow.
 * @function createDetailsTemplate
 */
function createDetailsTemplate(
  task,
  categoryId,
  subtasksHTML,
  assignedUsersHTML,
  priorityIcon,
  priorityLabel
) {
  return `
    <div class="details-card">
      <div class="details-header">
        <div id="${categoryId}" class="ticket-label">${task.category || 'User Story'}</div>
        <svg class="btn-close-white" onclick="toggleOverlay('#details-overlay')" width="32" height="32" viewBox="0 0 32 32" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M16.0001 17.8642L9.46673 24.389C9.22229 24.6331 8.91118 24.7552 8.5334 24.7552C8.15562 24.7552 7.84451 24.6331 7.60007 24.389C7.35562 24.1449 7.2334 23.8342 7.2334 23.4569C7.2334 23.0796 7.35562 22.7689 7.60007 22.5248L14.1334 16L7.60007 9.47527C7.35562 9.23115 7.2334 8.92045 7.2334 8.54316C7.2334 8.16588 7.35562 7.85518 7.60007 7.61106C7.84451 7.36693 8.15562 7.24487 8.5334 7.24487C8.91118 7.24487 9.22229 7.36693 9.46673 7.61106L16.0001 14.1358L22.5334 7.61106C22.7778 7.36693 23.089 7.24487 23.4667 7.24487C23.8445 7.24487 24.1556 7.36693 24.4001 7.61106C24.6445 7.85518 24.7667 8.16588 24.7667 8.54316C24.7667 8.92045 24.6445 9.23115 24.4001 9.47527L17.8667 16L24.4001 22.5248C24.6445 22.7689 24.7667 23.0796 24.7667 23.4569C24.7667 23.8342 24.6445 24.1449 24.4001 24.389C24.1556 24.6331 23.8445 24.7552 23.4667 24.7552C23.089 24.7552 22.7778 24.6331 22.5334 24.389L16.0001 17.8642Z"
          fill="#4589FF" />
        </svg>
      </div>
      <div class="details-body">
        <h2 class="details-title">${task.title}</h2>
        <p class="details-description">${task.description || ''}</p>
        <div class="details-due-date">
          <h3>Due Date:</h3>
          <p>${task.dueDate || 'No due date'}</p>
        </div>
        <div class="details-priority">
          <h3>Priority:</h3>
          <div class="task-priority">
            <img src="${priorityIcon}" alt="${priorityLabel}" class="priority-icon">
            <span>${priorityLabel}</span>
          </div>
        </div>
        <div class="details-assigned">
          <h3>Assigned To:</h3>
          <div class="task-users details">
            ${assignedUsersHTML || '<p>No assigned users</p>'}
          </div>
        </div>
        <div class="details-subtasks">
          <h3>Subtasks</h3>
          <div class="subtask-content">
            ${subtasksHTML || '<li>No subtasks</li>'}
          </div>
        </div>
        <div class="text-btn-container d-flex">
          <button class="text-btn-with-icon" onclick="deleteTask('${task.id}'); toggleOverlay('#details-overlay')">
            <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3C0.716667 3 0.479167 2.90417 0.2875 2.7125C0.0958333 2.52083 0 2.28333 0 2C0 1.71667 0.0958333 1.47917 0.2875 1.2875C0.479167 1.09583 0.716667 1 1 1H5C5 0.716667 5.09583 0.479167 5.2875 0.2875C5.47917 0.0958333 5.71667 0 6 0H10C10.2833 0 10.5208 0.0958333 10.7125 0.2875C10.9042 0.479167 11 0.716667 11 1H15C15.2833 1 15.5208 1.09583 15.7125 1.2875C15.9042 1.47917 16 1.71667 16 2C16 2.28333 15.9042 2.52083 15.7125 2.7125C15.5208 2.90417 15.2833 3 15 3V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM3 3V16H13V3H3ZM5 13C5 13.2833 5.09583 13.5208 5.2875 13.7125C5.47917 13.9042 5.71667 14 6 14C6.28333 14 6.52083 13.9042 6.7125 13.7125C6.90417 13.5208 7 13.2833 7 13V6C7 5.71667 6.90417 5.47917 6.7125 5.2875C6.52083 5.09583 6.28333 5 6 5C5.71667 5 5.47917 5.09583 5.2875 5.2875C5.09583 5.47917 5 5.71667 5 6V13ZM9 13C9 13.2833 9.09583 13.5208 9.2875 13.7125C9.47917 13.9042 9.71667 14 10 14C10.2833 14 10.5208 13.9042 10.7125 13.7125C10.9042 13.5208 11 13.2833 11 13V6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6V13Z" fill="#4589FF"/>
            </svg>
            Delete Task
          </button>
          <div class="vertical-divider"></div>
          <button class="text-btn-with-icon" onclick="editTask('${task.id}')">
            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 16.25H3.4L12.025 7.625L10.625 6.225L2 14.85V16.25ZM16.3 6.175L12.05 1.975L13.45 0.575C13.8333 0.191667 14.3042 0 14.8625 0C15.4208 0 15.8917 0.191667 16.275 0.575L17.675 1.975C18.0583 2.35833 18.2583 2.82083 18.275 3.3625C18.2917 3.90417 18.1083 4.36667 17.725 4.75L16.3 6.175ZM14.85 7.65L4.25 18.25H0V14L10.6 3.4L14.85 7.65Z" fill="#4589FF"/>
            </svg>
            Edit Task
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Saves tasks to sessionStorage
 */
function saveTasksToSession() {
  sessionStorage.setItem("tasks", JSON.stringify(tasks));
}


/**
 * Loads tasks from sessionStorage
 * @returns {Array|null} Tasks array or null if not found
 */
function loadTasksFromSession() {
  let storedTasks = sessionStorage.getItem("tasks");
  return storedTasks ? JSON.parse(storedTasks) : null;
}

