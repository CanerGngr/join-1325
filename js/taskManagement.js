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
		// Logged-in user: Load from Firebase — return empty array if no tasks yet
		return await loadTasksFromFirebase();
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
				{ text: "Start Page Layout", completed: true },
			],
			dueDate: "2024-05-10",
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
				{ text: "Navigation Template", completed: true },
			],
			dueDate: "2024-05-12",
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
				{ text: "Create Component Structure", completed: false },
			],
			dueDate: "2024-05-15",
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
				{ text: "Data Management", completed: false },
			],
			dueDate: "2024-05-08",
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
				{ text: "Status Management", completed: false },
			],
			dueDate: "2024-05-20",
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
				{ text: "Contact Form", completed: true },
			],
			dueDate: "2024-05-05",
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
				{ text: "Data Validation", completed: true },
			],
			dueDate: "2024-05-03",
		},
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
	urgent: "High ",
	medium: "Medium ",
	low: "Low",
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
		subtaskData,
	);
}

/**
 * Handles the generateAssignedUsersHTML workflow.
 * @function generateAssignedUsersHTML
 */
function generateAssignedUsersHTML(assignedToArray) {
	let html = "";
	const maxVisibleAssignees = 4;
	const visibleAssignees = assignedToArray.slice(0, maxVisibleAssignees);

	for (let i = 0; i < visibleAssignees.length; i++) {
		let initials = getInitials(visibleAssignees[i]);
		let userColor = getAvatarColor(visibleAssignees[i]);
		html += `<div class="user-avatar-sm" style="background-color: ${userColor};">${initials}</div>`;
	}

	const hiddenAssigneesCount = assignedToArray.length - visibleAssignees.length;
	if (hiddenAssigneesCount > 0) {
		html += `<div class="user-avatar-sm more-assignees">+${hiddenAssigneesCount}</div>`;
	}

	return html;
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
		container.innerHTML = container.innerHTML += generateTaskCardHTML(task);
	}
}

/**
 * Handles the clearColumnTaskCards workflow.
 * @function clearColumnTaskCards
 */
function clearColumnTaskCards(column) {
	const container = document.getElementById(column.id + "-cards");
	container.innerHTML = `
  <div class="empty-task-container">
    <p>No tasks ${column.dataset.status}</p>
  </div>
  `;
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
			await firebase
				.database()
				.ref(`boards/${userId}/tasks/${taskId}`)
				.update({ status: newStatus });
		} catch (error) {
			console.error("Error updating task status:", error);
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
				await firebase
					.database()
					.ref(`boards/${userId}/tasks/${taskId}`)
					.remove();
				tasks.splice(taskIndex, 1);
			} catch (error) {
				console.error("Error deleting task:", error);
			}
		}
		renderAllTasks();
		showDeleteSuccessOverlay();
	}
}

/**
 * Shows a success overlay when a task is deleted.
 * @function showDeleteSuccessOverlay
 */
function showDeleteSuccessOverlay() {
	let overlay = document.getElementById("delete-success-overlay");
	if (!overlay) return;
	overlay.classList.remove("d-none");
	setTimeout(function () {
		overlay.classList.add("d-none");
	}, 1500);
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
	let subtasksHTML = generateSubtasksHTML(task.id, task.subtasks || []);
	let assignedUsersHTML = generateAssignedUsersDetailsHTML(
		task.assignedTo || [],
	);

	return createDetailsTemplate(
		task,
		categoryId,
		subtasksHTML,
		assignedUsersHTML,
		priorityIcon,
		priorityLabel,
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
