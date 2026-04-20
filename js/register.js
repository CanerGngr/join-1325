/**
 * @fileoverview User registration flow and validation.
 * Manages form state, validation, and user creation logic.
 * @version 1.0.0
 * @author Join-1325 Development Team
 */
const CONFIG = {
  routes: {
    login: "../html/login.html", // Default login redirect path
  },
};

const newUser = { name: "", email: "", password: "" };

// Validation state tracker
const validationState = {
  name: false,
  email: false,
  password: false,
  confirmPassword: false
};

/**
 * Handles the handleRegisterUser workflow.
 * @function handleRegisterUser
 */
async function submitRegistration() {
  try {
    await addNewUser(newUser);
    showSuccessAndRedirect();
  } catch (error) {
    console.error("Error registering user:", error);
    const errorOverlay = document.getElementById("errorMessage");
    if (errorOverlay) {
      errorOverlay.textContent = "Registration failed. Please try again.";
      errorOverlay.classList.remove("d-none");
    }
  }
}

async function handleRegisterUser(event) {
  event.preventDefault();
  const isFormValid = await validateRegisterFormOnSubmit();
  if (!isFormValid) {
    return;
  }
  await submitRegistration();
}


/**
 * Validates all register fields on submit to ensure
 * errors are shown even when the user did not type before submitting.
 * @returns {Promise<boolean>} True when all required fields are valid
 */
async function validateRegisterFormOnSubmit() {
  const values = readRegisterFormValues();
  const isNameValid = await isUserExistByName(values.name);
  const isEmailValid = await isUserExistByEmail(values.email);
  ensureRealPasswordsCaptured(values.password, values.confirmPassword);
  onPasswordBlur(realPassword);
  isPasswordMatching();
  const isPrivacyAccepted = validatePrivacyCheckbox();
  return isNameValid && isEmailValid && validationState.password && validationState.confirmPassword && isPrivacyAccepted;
}


/**
 * Reads the register form fields into a plain object.
 * @function readRegisterFormValues
 */
function readRegisterFormValues() {
  return {
    name: (document.getElementById("input-name")?.value || "").trim(),
    email: (document.getElementById("input-email")?.value || "").trim(),
    password: document.getElementById("input-password")?.value ?? "",
    confirmPassword: document.getElementById("input-password-confirm")?.value ?? "",
  };
}


/**
 * Captures the real (unmasked) password values when submit fires before an input event.
 * @function ensureRealPasswordsCaptured
 */
function ensureRealPasswordsCaptured(passwordValue, confirmPasswordValue) {
  if (!realPassword && passwordValue && !/^\*+$/.test(passwordValue)) realPassword = passwordValue;
  if (!realConfirmPassword && confirmPasswordValue && !/^\*+$/.test(confirmPasswordValue)) realConfirmPassword = confirmPasswordValue;
}


/**
 * Validates the privacy checkbox, toggles the error message and returns the state.
 * @function validatePrivacyCheckbox
 */
function validatePrivacyCheckbox() {
  const checkbox = document.getElementById("privacy-checkbox");
  const accepted = !!checkbox?.checked;
  if (accepted) toggleErrorMessage("checkbox-error", true);
  else toggleErrorMessage("checkbox-error", false, "Please accept the Privacy policy.");
  return accepted;
}


/**
 * Handles the isUserExistByName workflow.
 * @function isUserExistByName
 */
async function isUserExistByName(inputName) {
  if (!inputName || !inputName.trim()) return setNameValidation(false, "Username cannot be empty");
  if (await isUserNameTaken(inputName)) return setNameValidation(false, "Username already exists!");
  newUser.name = inputName;
  return setNameValidation(true);
}


/**
 * Applies the username validation result to the UI and shared state.
 * @function setNameValidation
 */
function setNameValidation(isValid, errorMsg) {
  handleErrorSet("field-name", "username-error", isValid, errorMsg);
  validationState.name = isValid;
  checkAllFieldsValid();
  return isValid;
}


/**
 * Handles the isUserExistByEmail workflow.
 * @function isUserExistByEmail
 */
async function isUserExistByEmail(inputEmail) {
  if (!inputEmail || !inputEmail.trim()) return setEmailValidation(false, "E-Mail cannot be empty");
  try {
    if (!validateEmailFormat(inputEmail)) return markEmailInvalid();
    if (await isUserEmailTaken(inputEmail)) return setEmailValidation(false, "E-Mail already exists!");
    newUser.email = inputEmail;
    return setEmailValidation(true);
  } catch (error) {
    console.error("Error validating email:", error);
    return setEmailValidation(false, "Error validating email. Please try again.");
  }
}


/**
 * Applies the email validation result to the UI and shared state.
 * @function setEmailValidation
 */
function setEmailValidation(isValid, errorMsg) {
  handleErrorSet("field-email", "email-error", isValid, errorMsg);
  validationState.email = isValid;
  checkAllFieldsValid();
  return isValid;
}


/**
 * Marks the email invalid without overwriting the format error message.
 * @function markEmailInvalid
 */
function markEmailInvalid() {
  validationState.email = false;
  checkAllFieldsValid();
  return false;
}


/**
 * Handles the validateEmailFormat workflow.
 * @function validateEmailFormat
 */
function validateEmailFormat(inputEmail) {
  const emailRegex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;
  if (emailRegex.test(inputEmail)) return true;
  handleErrorSet("field-email", "email-error", false, "Please enter a valid E-Mail!");
  return false;
}


/**
 * Handles the toggleCheckBox workflow.
 * @function toggleCheckBox
 */
function toggleCheckBox(event) {
  if (event.target.tagName === "A") return;
  const checkbox = document.getElementById("privacy-checkbox");
  if (checkbox.disabled) { event.preventDefault(); return; }
  setTimeout(() => applyPrivacyCheckboxState(checkbox), 0);
}


/**
 * Applies the checked state of the privacy checkbox to the signup button and errors.
 * @function applyPrivacyCheckboxState
 */
function applyPrivacyCheckboxState(checkbox) {
  const signUpButton = document.getElementById("btn-signup");
  if (checkbox.checked) {
    signUpButton.disabled = false;
    toggleErrorMessage("checkbox-error", true);
  } else {
    signUpButton.disabled = true;
  }
}


/**
 * Handles the handleErrorSet workflow.
 * @function handleErrorSet
 */
function handleErrorSet(
  fieldId,
  errorId,
  status,
  errorMessage = ""
) {
  if (status) {
    removeBorderColor(fieldId);
  } else {
    setBorderColor(fieldId, false);
  }
  toggleErrorMessage(errorId, status, errorMessage);
}


/**
 * Handles the toggleErrorMessage workflow.
 * @function toggleErrorMessage
 */
function toggleErrorMessage(elementId, isValid, message = "") {
  const el = document.getElementById(elementId);
  if (!el) return;
  if (isValid) hideErrorMessage(el);
  else showErrorMessage(el, elementId, message);
}


/**
 * Hides and clears the error message element.
 * @function hideErrorMessage
 */
function hideErrorMessage(el) {
  el.classList.add("d-none");
  el.textContent = "";
  el.innerHTML = "";
}


/**
 * Shows an error message; uses innerHTML for the password tooltip, textContent otherwise.
 * @function showErrorMessage
 */
function showErrorMessage(el, elementId, message) {
  el.classList.remove("d-none");
  if (elementId === "password-tooltip") el.innerHTML = message;
  else el.textContent = message;
}


/**
 * Handles the showSuccessAndRedirect workflow.
 * @function showSuccessAndRedirect
 */
function showSuccessAndRedirect(redirectPath = CONFIG.routes.login) {
  const overlay = document.getElementById("success-overlay");
  if (!overlay) {
    console.error("Success overlay not found");
    window.location.href = redirectPath;
    return;
  }
  overlay.classList.remove("d-none");

  setTimeout(function () {
    window.location.href = redirectPath;
  }, 2000);
}


/**
 * Handles the removeBorderColor workflow.
 * @function removeBorderColor
 */
function removeBorderColor(inputField) {
  const fieldInput = document.getElementById(inputField);
  if (!fieldInput) {
    console.warn(`removeBorderColor: element with id "${inputField}" not found.`);
    return;
  }
  fieldInput.classList.remove("valid-input", "invalid-input");
}


/**
 * Handles the setBorderColor workflow.
 * @function setBorderColor
 */
function setBorderColor(inputField, status) {
  const fieldInput = document.getElementById(inputField);
  if (!fieldInput) {
    console.warn(`setBorderColor: element with id "${inputField}" not found.`);
    return;
  }
  fieldInput.classList.remove("valid-input", "invalid-input");
  fieldInput.classList.add(status ? "valid-input" : "invalid-input");
}


/**
 * Checks if all input fields are valid and enables the checkbox if so
 */
function checkAllFieldsValid() {
  const allValid = validationState.name && validationState.email && validationState.password && validationState.confirmPassword;
  const checkbox = document.getElementById("privacy-checkbox");
  const button = document.getElementById("btn-signup");
  if (checkbox) checkbox.disabled = !allValid;
  if (!allValid) {
    if (checkbox) checkbox.checked = false;
    if (button) button.disabled = true;
  }
}


/**
 * Runs validation on page load if any input fields are pre-filled
 * (e.g. browser auto-fill or back-navigation restore).
 * Does nothing when all fields are empty (fresh page load).
 */
function initRegisterValidation() {
  const nameVal    = document.getElementById("input-name")?.value || "";
  const emailVal   = document.getElementById("input-email")?.value || "";
  const passVal    = document.getElementById("input-password")?.value || "";
  const confirmVal = document.getElementById("input-password-confirm")?.value || "";

  if (!nameVal && !emailVal && !passVal && !confirmVal) return;

  if (nameVal)    isUserExistByName(nameVal);
  if (emailVal)   isUserExistByEmail(emailVal);
  if (passVal) {
    realPassword = passVal;
    onPasswordBlur(passVal);
  }
  if (confirmVal) {
    realConfirmPassword = confirmVal;
    isPasswordMatching();
  }
}
