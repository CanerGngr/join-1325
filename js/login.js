/**
 * @fileoverview Login module for Join Kanban Project Management Tool
 * Manages user authentication via Firebase Realtime Database
 * @author Join-1325 Development Team
 * @version 1.0.0
 */

/**
 * Validates user login credentials against Firebase Realtime Database
 * Searches for matching email and password combination in the database
 * Stores user information in SessionStorage upon successful authentication
 *
 * @async
 * @function loginUser
 * @returns {Promise<boolean>} True on successful login, false on error
 * @throws {Error} Throws error on database connection problems
 *
 * @example
 * // Triggered by form submit event
 * await loginUser();
 */
async function loginUser() {
  sessionStorage.clear();
  const email = document.getElementById("email-input").value.trim();
  const password = document.getElementById("password-input").value;
  const errorMessage = document.getElementById("error-message");

  // Reset error message
  errorMessage.style.display = "none";
  errorMessage.textContent = "";

  // Validation
  if (!email || !password) {
    showError("Please fill in all fields.");
    return false;
  }

  try {
    // Retrieve users from database
    const usersRef = firebase.database().ref("users");
    const snapshot = await usersRef.once("value");
    const users = snapshot.val();

    if (!users) {
      showError("Email or password is incorrect.");
      return false;
    }

    // Find user and verify password
    let userFound = false;
    let userId = null;
    let userName = null;

    for (let key in users) {
      if (users[key].email === email && users[key].password === password) {
        userFound = true;
        userId = key;
        userName = users[key].name;
        break;
      }
    }

    if (userFound) {
      // Successful login - Save session
      sessionStorage.setItem("userEmail", email);
      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("userName", userName);
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("isGuest", "false");

      // Redirect to index page
      window.location.href = "/index.html";
      return true;
    } else {
      showError("Email or password is incorrect.");
      return false;
    }
  } catch (error) {
    console.error("Login error:", error);
    showError("An error occurred. Please try again.");
    return false;
  }
}


/**
 * Displays an error message in the login form
 * Makes the error message element visible and sets the error text
 *
 * @function showError
 * @param {string} message - The error message to display
 * @returns {void}
 *
 * @example
 * showError('Email or password is incorrect.');
 */
function showError(message) {
  const errorMessage = document.getElementById("error-message");
  if (!errorMessage) {
    console.warn("Error message element not found in the DOM");
    return;
  }
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
}


/**
 * Sets session data for a guest user
 * Stores predefined guest credentials in SessionStorage
 * Called when the user clicks on "Guest log in"
 *
 * @function setGuestSession
 * @returns {void}
 *
 * @example
 * // Triggered by onclick event in HTML
 * setGuestSession();
 */
function setGuestSession() {
  sessionStorage.setItem("userEmail", "guest@join.com");
  sessionStorage.setItem("userId", "guest");
  sessionStorage.setItem("userName", "Guest");
  sessionStorage.setItem("isLoggedIn", "true");
  sessionStorage.setItem("isGuest", "true");
}


function loginAsGuest() {
  setGuestSession();
  window.location.href = "/index.html";
}


/**
 * Initializes the login form with event listeners
 * Binds the submit event to the loginUser function
 * Prevents default form submit behavior
 *
 * @function initLoginForm
 * @returns {void}
 *
 * @example
 * // Called automatically when page loads
 * initLoginForm();
 */
function initLoginForm() {
  const loginForm = document.getElementById("log-in-form");

  if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      await loginUser();
    });
  }
}

// Initialize on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLoginForm);
} else {
  initLoginForm();
}
