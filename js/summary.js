/**
 * @fileoverview Summary module for Join Kanban Project Management Tool
 * Manages the summary page with personalized greeting
 * Session management is handled by script.js
 * @author Join-1325 Development Team
 * @version 1.0.0
 */

/**
 * Returns the appropriate time-of-day greeting
 * Based on the current time, a corresponding greeting is selected
 * 
 * @function getTimeOfDayGreeting
 * @returns {string} Greeting text based on time of day
 *                   - "Good morning" (05:00-11:59)
 *                   - "Good afternoon" (12:00-17:59)
 *                   - "Good evening" (18:00-21:59)
 *                   - "Good night" (22:00-04:59)
 * 
 * @example
 * const greeting = getTimeOfDayGreeting();
 * console.log(greeting); // "Good morning"
 */
function getTimeOfDayGreeting() {
    let hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
        return 'Good morning';
    } else if (hour >= 12 && hour < 18) {
        return 'Good afternoon';
    } else if (hour >= 18 && hour < 22) {
        return 'Good evening';
    } else {
        return 'Good night';
    }
}


/**
 * Updates the greeting text on the summary page
 * Displays time-based greeting with username for logged-in users
 * Guest users receive only the time-of-day greeting without name
 * 
 * @function updateGreeting
 * @returns {void}
 * 
 * @example
 * // For logged-in user: "Good morning, John Doe"
 * // For guest user: "Good morning"
 * updateGreeting();
 */
function updateGreeting() {
    let greetingElement = document.getElementById('summary-greeting');

    if (!greetingElement) return;

    let isGuest = sessionStorage.getItem('isGuest');
    let userName = sessionStorage.getItem('userName');
    let timeGreeting = getTimeOfDayGreeting();

    if (isGuest === 'true') {
        greetingElement.textContent = timeGreeting;
    } else if (userName) {
        greetingElement.textContent = timeGreeting + ', ' + userName;
    } else {
        greetingElement.textContent = timeGreeting;
    }
}

/**
 * Returns the summary greeting heading element.
 *
 * @function getSummaryGreetingElement
 * @returns {HTMLElement|null} Greeting heading element or null if not found
 */
function getSummaryGreetingElement() {
    return document.getElementById('summary-greeting');
}

/**
 * Checks if current viewport is mobile width.
 *
 * @function isSummaryMobileViewport
 * @returns {boolean} True when viewport width is 850px or less
 */
function isSummaryMobileViewport() {
    return window.matchMedia('(max-width: 850px)').matches;
}

/**
 * Removes all intro animation classes from greeting element.
 *
 * @function resetSummaryGreetingClasses
 * @param {HTMLElement} greetingElement - Greeting element to clean up
 * @returns {void}
 */
function resetSummaryGreetingClasses(greetingElement) {
    greetingElement.classList.remove(
        'summary-greeting-intro',
        'summary-greeting-slide-up',
        'summary-greeting-hidden'
    );
}

/**
 * Clears all active greeting intro timers.
 *
 * @function clearSummaryGreetingTimers
 * @returns {void}
 */
function clearSummaryGreetingTimers() {
    if (window.__joinSummaryGreetingIntroTimeout) {
        window.clearTimeout(window.__joinSummaryGreetingIntroTimeout);
    }
    if (window.__joinSummaryGreetingHideTimeout) {
        window.clearTimeout(window.__joinSummaryGreetingHideTimeout);
    }
}

/**
 * Applies initial intro classes before animation starts.
 *
 * @function prepareSummaryGreetingIntro
 * @param {HTMLElement} greetingElement - Greeting element to prepare
 * @returns {void}
 */
function prepareSummaryGreetingIntro(greetingElement) {
    greetingElement.classList.remove('summary-greeting-hidden');
    greetingElement.classList.add('summary-greeting-intro');
}

/**
 * Schedules the slide-up step of the intro animation.
 *
 * @function scheduleSummaryGreetingSlideUp
 * @param {HTMLElement} greetingElement - Greeting element to animate
 * @returns {void}
 */
function scheduleSummaryGreetingSlideUp(greetingElement) {
    window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
            window.__joinSummaryGreetingIntroTimeout = window.setTimeout(() => {
                greetingElement.classList.add('summary-greeting-slide-up');
            }, 500);
        });
    });
}

/**
 * Schedules hiding of the greeting after slide-up animation.
 *
 * @function scheduleSummaryGreetingHide
 * @param {HTMLElement} greetingElement - Greeting element to hide
 * @returns {void}
 */
function scheduleSummaryGreetingHide(greetingElement) {
    window.__joinSummaryGreetingHideTimeout = window.setTimeout(() => {
        greetingElement.classList.add('summary-greeting-hidden');
        greetingElement.classList.remove('summary-greeting-intro', 'summary-greeting-slide-up');
    }, 1200);
}

/**
 * Shows greeting as full-size intro and slides it up out of summary content.
 *
 * @function startGreetingIntroAnimation
 * @returns {void}
 */
function startGreetingIntroAnimation() {
    let greetingElement = getSummaryGreetingElement();
    if (!isSummaryMobileViewport()) {
        resetSummaryGreetingClasses(greetingElement);
        return;
    }

    clearSummaryGreetingTimers();
    prepareSummaryGreetingIntro(greetingElement);
    scheduleSummaryGreetingSlideUp(greetingElement);
    scheduleSummaryGreetingHide(greetingElement);
}

/**
 * Ensures greeting visibility state matches current viewport size
 *
 * @function syncGreetingVisibilityForViewport
 * @returns {void}
 */
function syncGreetingVisibilityForViewport() {
    let greetingElement = getSummaryGreetingElement();

    if (!greetingElement || isSummaryMobileViewport()) return;

    resetSummaryGreetingClasses(greetingElement);
}

/**
 * Handles summary resize via inline HTML event
 *
 * @function handleSummaryResize
 * @returns {void}
 */
function handleSummaryResize() {
    syncGreetingVisibilityForViewport();
}


/**
 * Loads all tasks from Firebase or SessionStorage
 * Returns an array of task objects
 *
 * @async
 * @function loadAllTasks
 * @returns {Promise<Array>} Array of all tasks
 */
async function loadAllTasks() {
    let isGuest = sessionStorage.getItem('isGuest') === 'true';

    if (isGuest) {
        return getGuestTasks();
    } else {
        if (typeof loadTasksFromFirebase === 'function') {
            let tasks = await loadTasksFromFirebase();
            return tasks;
        } else {
            return [];
        }
    }
}

function getGuestTasks() {
    let tasksJson = sessionStorage.getItem('tasks');
    let tasks = tasksJson ? JSON.parse(tasksJson) : [];

    if (tasks.length === 0 && typeof getDefaultTasks === 'function') {
        tasks = getDefaultTasks();
    }

    return tasks;
}



/**
 * Calculates task statistics from tasks array
 * Returns an object with counts for each status and priority
 *
 * @function calculateTaskStatistics
 * @param {Array} tasks - Array of task objects
 * @returns {Object} Statistics object with task counts
 */
function calculateTaskStatistics(tasks) {
    let statistics = {
        total: 0,
        todo: 0,
        inProgress: 0,
        awaitingFeedback: 0,
        done: 0,
        urgent: 0,
        urgentDeadline: null
    };

    if (!tasks || tasks.length === 0) {
        return statistics;
    }

    statistics.total = tasks.length;

    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];

        if (task.status === 'todo') {
            statistics.todo++;
        } else if (task.status === 'in-progress') {
            statistics.inProgress++;
        } else if (task.status === 'await-feedback') {
            statistics.awaitingFeedback++;
        } else if (task.status === 'done') {
            statistics.done++;
        }

        if (task.priority === 'urgent') {
            statistics.urgent++;
            if (task.dueDate) {
                updateUrgentDeadlineIfEarlier(statistics, task.dueDate);
            }
        }
    }
    return statistics;
}


/**
 * Updates urgent deadline if new date is earlier
 *
 * @function updateUrgentDeadlineIfEarlier
 * @param {Object} statistics - Statistics object to update
 * @param {string} newDate - New date to compare
 * @returns {void}
 */
function updateUrgentDeadlineIfEarlier(statistics, newDate) {
    if (!statistics.urgentDeadline) {
        statistics.urgentDeadline = newDate;
        return;
    }

    let currentDate = new Date(statistics.urgentDeadline);
    let compareDate = new Date(newDate);

    if (compareDate < currentDate) {
        statistics.urgentDeadline = newDate;
    }
}


/**
 * Updates task count displays on the summary page
 * Fetches task statistics and updates the DOM elements
 *
 * @async
 * @function updateTaskCounts
 * @returns {Promise<void>}
 */
async function updateTaskCounts() {
    let tasks = await loadAllTasks();
    let stats = calculateTaskStatistics(tasks);

    updateUrgentCount(stats.urgent);
    updateBoardCount(stats.total);
    updateTodoCount(stats.todo);
    updateProgressCount(stats.inProgress);
    updateFeedbackCount(stats.awaitingFeedback);
    updateDoneCount(stats.done);
    updateUrgentDeadline(stats.urgentDeadline);
}


/**
 * Updates urgent tasks count
 *
 * @function updateUrgentCount
 * @param {number} count - Number of urgent tasks
 * @returns {void}
 */
function updateUrgentCount(count) {
    let element = document.getElementById('urgent-tasks-count');
    if (element) {
        element.textContent = count;
    }
}


/**
 * Updates total board tasks count
 *
 * @function updateBoardCount
 * @param {number} count - Total number of tasks
 * @returns {void}
 */
function updateBoardCount(count) {
    let element = document.getElementById('board-tasks-count');
    if (element) {
        element.textContent = count;
    }
}


/**
 * Updates todo tasks count
 *
 * @function updateTodoCount
 * @param {number} count - Number of todo tasks
 * @returns {void}
 */
function updateTodoCount(count) {
    let element = document.getElementById('todo-tasks-count');
    if (element) {
        element.textContent = count;
    }
}


/**
 * Updates in progress tasks count
 *
 * @function updateProgressCount
 * @param {number} count - Number of in progress tasks
 * @returns {void}
 */
function updateProgressCount(count) {
    let element = document.getElementById('progress-tasks-count');
    if (element) {
        element.textContent = count;
    }
}


/**
 * Updates awaiting feedback tasks count
 *
 * @function updateFeedbackCount
 * @param {number} count - Number of awaiting feedback tasks
 * @returns {void}
 */
function updateFeedbackCount(count) {
    let element = document.getElementById('feedback-tasks-count');
    if (element) {
        element.textContent = count;
    }
}


/**
 * Updates done tasks count
 *
 * @function updateDoneCount
 * @param {number} count - Number of done tasks
 * @returns {void}
 */
function updateDoneCount(count) {
    let element = document.getElementById('done-tasks-count');
    if (element) {
        element.textContent = count;
    }
}


/**
 * Formats date to readable string format
 *
 * @function formatDeadlineDate
 * @param {string} dateString - Date string in ISO format
 * @returns {string} Formatted date string
 */
function formatDeadlineDate(dateString) {
    if (!dateString) return '';

    let date = new Date(dateString);
    let options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}


/**
 * Updates urgent deadline display
 *
 * @function updateUrgentDeadline
 * @param {string} deadline - Date string for urgent deadline
 * @returns {void}
 */
function updateUrgentDeadline(deadline) {
    let element = document.getElementById('urgent-deadline');
    if (element) {
        let formattedDate = formatDeadlineDate(deadline);
        element.textContent = formattedDate || 'No deadline';
    }
}


/**
 * Initializes the summary page
 * Updates the greeting (session check is handled by script.js)
 * Called automatically when page loads
 *
 * @function initSummary
 * @returns {void}
 *
 * @example
 * // Automatic call on page load
 * initSummary();
 */
async function initSummary() {
    updateGreeting();
    startGreetingIntroAnimation();

    await updateTaskCounts();
}
