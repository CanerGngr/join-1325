/**
 * Adds a new task to Firebase (for logged-in users) or SessionStorage (for guests)
 * Firebase automatically generates unique IDs for logged-in users
 * Tasks are stored under boards/{userId}/tasks/{taskId}
 * @async
 * @param {Object} taskData - The task object to save
 * @returns {Promise<void>}
 */
async function addNewTask(taskData) {
  const isGuest = sessionStorage.getItem("isGuest") === "true";
  
  if (isGuest) {
    // Guest user: Save to SessionStorage only
    tasks.push(taskData);
    saveTasksToSession();
  } else {
    // Logged-in user: Save to Firebase under user's board
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      return;
    }
    try {
      const userTasksRef = firebase.database().ref(`boards/${userId}/tasks`);
      const newTaskRef = userTasksRef.push(); // Firebase generates unique ID
      
      // Create task object without the manually generated ID
      // Firebase will assign its own ID
      const taskForFirebase = {
        title: taskData.title,
        description: taskData.description,
        category: taskData.category,
        assignedTo: taskData.assignedTo,
        priority: taskData.priority,
        status: taskData.status,
        subtasks: taskData.subtasks,
        dueDate: taskData.dueDate
      };
      
      await newTaskRef.set(taskForFirebase);
      
      // Update local tasks array with Firebase ID
      taskData.id = newTaskRef.key;
      tasks.push(taskData);
    } catch (error) {
      console.error("Error saving task:", error);
    }
  }
}


/**
 * Loads tasks from Firebase for logged-in users
 * Tasks are loaded from boards/{userId}/tasks/
 * @async
 * @returns {Promise<Array>} Array of tasks from Firebase
 */
async function loadTasksFromFirebase() {
  const userId = sessionStorage.getItem("userId");
  if (!userId) {
    console.error("No userId found in session");
    return [];
  }
  
  try {
    const userTasksRef = firebase.database().ref(`boards/${userId}/tasks`);
    const snapshot = await userTasksRef.once("value");
    const tasksData = snapshot.val();
    
    if (!tasksData) {
      return [];
    }
    
    // Convert Firebase object to array with IDs
    const tasksArray = [];
    for (let key in tasksData) {
      tasksArray.push({
        id: key,
        ...tasksData[key]
      });
    }
    return tasksArray;
  } catch (error) {
    console.error("Error loading tasks from Firebase:", error);
    return [];
  }
}


/**
 * Updates a task in Firebase (for logged-in users) or SessionStorage (for guests)
 * Updates task at boards/{userId}/tasks/{taskId}
 * @async
 * @param {string} taskId - The ID of the task to update
 * @param {Object} updates - Object containing the fields to update
 * @returns {Promise<void>}
 */
async function updateTask(taskId, updates) {
  const isGuest = sessionStorage.getItem("isGuest") === "true";
  
  // Find and update task in local array
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    Object.assign(task, updates);
    
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
        await firebase.database().ref(`boards/${userId}/tasks/${taskId}`).update(updates);
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
  }
}