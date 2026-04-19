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
  document.getElementById("error-message").textContent = "";
  const { email, password } = readLoginInputs();
  if (!email || !password) { showError("Please fill in all fields."); return false; }
  try {
    return await attemptLogin(email, password);
  } catch (error) {
    console.error("Login error:", error);
    showError("An error occurred. Please try again.");
    return false;
  }
}


/**
 * Reads email and password fields from the login form.
 * @function readLoginInputs
 */
function readLoginInputs() {
  return {
    email: document.getElementById("email-input").value.trim(),
    password: document.getElementById("password-input").value,
  };
}


/**
 * Loads users from Firebase, verifies credentials and starts the session on success.
 * @function attemptLogin
 */
async function attemptLogin(email, password) {
  const snapshot = await firebase.database().ref("users").once("value");
  const users = snapshot.val();
  const match = users ? findMatchingUser(users, email, password) : null;
  if (!match) { showError("Check your email and password. Please try again."); return false; }
  storeUserSession(email, match.userId, match.userName);
  window.location.href = "/index.html";
  return true;
}


/**
 * Returns {userId, userName} for a user whose email and password match, or null.
 * @function findMatchingUser
 */
function findMatchingUser(users, email, password) {
  for (let key in users) {
    if (users[key].email === email && users[key].password === password) {
      return { userId: key, userName: users[key].name };
    }
  }
  return null;
}


/**
 * Persists the authenticated user's info to sessionStorage.
 * @function storeUserSession
 */
function storeUserSession(email, userId, userName) {
  sessionStorage.setItem("userEmail", email);
  sessionStorage.setItem("userId", userId);
  sessionStorage.setItem("userName", userName);
  sessionStorage.setItem("isLoggedIn", "true");
  sessionStorage.setItem("isGuest", "false");
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
  errorMessage.textContent = message;
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


/**
 * Handles the loginAsGuest workflow.
 * @function loginAsGuest
 */
function loginAsGuest() {
  setGuestSession();
  window.location.href = "/index.html";
}

/**
 * Handles the updateRememberMeCheckboxState workflow.
 * @function updateRememberMeCheckboxState
 */
function updateRememberMeCheckboxState() {
  const emailInput = document.getElementById("email-input");
  const passwordInput = document.getElementById("password-input");
  const rememberMeCheckbox = document.getElementById("remember-me-checkbox");
  const isEmailValid = emailInput.checkValidity() && emailInput.value.trim() !== "";
  const isPasswordValid = passwordInput.value.trim() !== "";
  const shouldEnableCheckbox = isEmailValid && isPasswordValid;

  rememberMeCheckbox.disabled = !shouldEnableCheckbox;

  if (!shouldEnableCheckbox) {
    rememberMeCheckbox.checked = false;
  }
}


/** * Handles the form submission for user login.
 * Prevents default form submission behavior and calls loginUser function.
 * @param {Event} event - The form submission event
 * @returns {Promise<void>}
 * @example
 * // Triggered by form submit event in HTML
 * <form onsubmit="handleSubmit(event)">
 */
async function handleSubmit(event) {
    event.preventDefault();
    await loginUser();
  };


updateRememberMeCheckboxState();
