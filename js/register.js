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
async function handleRegisterUser(event) {
  event.preventDefault();
  const isFormValid = await validateRegisterFormOnSubmit();
  if (!isFormValid) {
    return;
  }

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


/**
 * Validates all register fields on submit to ensure
 * errors are shown even when the user did not type before submitting.
 * @returns {Promise<boolean>} True when all required fields are valid
 */
async function validateRegisterFormOnSubmit() {
  const nameInput = document.getElementById("input-name");
  const emailInput = document.getElementById("input-email");
  const passwordInput = document.getElementById("input-password");
  const confirmPasswordInput = document.getElementById("input-password-confirm");

  const nameValue = nameInput ? nameInput.value.trim() : "";
  const emailValue = emailInput ? emailInput.value.trim() : "";
  const passwordValue = passwordInput ? passwordInput.value : "";
  const confirmPasswordValue = confirmPasswordInput ? confirmPasswordInput.value : "";

  const isNameValid = await isUserExistByName(nameValue);
  const isEmailValid = await isUserExistByEmail(emailValue);

  if (!realPassword && passwordValue && !/^\*+$/.test(passwordValue)) {
    realPassword = passwordValue;
  }
  onPasswordBlur(realPassword);

  if (!realConfirmPassword && confirmPasswordValue && !/^\*+$/.test(confirmPasswordValue)) {
    realConfirmPassword = confirmPasswordValue;
  }
  isPasswordMatching();

  const isPasswordValidNow = validationState.password;
  const isConfirmPasswordValidNow = validationState.confirmPassword;

  return isNameValid && isEmailValid && isPasswordValidNow && isConfirmPasswordValidNow;
}


/**
 * Handles the isUserExistByName workflow.
 * @function isUserExistByName
 */
async function isUserExistByName(inputName) {
  if (!inputName || !inputName.trim()) {
    handleErrorSet(
      "field-name",
      "username-error",
      false,
      "Username cannot be empty"
    );
    validationState.name = false;
    checkAllFieldsValid();
    return false;
  }
  const exists = await isUserNameTaken(inputName);
  if (exists) {
    handleErrorSet(
      "field-name",
      "username-error",
      false,
      "Username already exists!"
    );
    validationState.name = false;
    checkAllFieldsValid();
    return false;
  } else {
    newUser.name = inputName;
    handleErrorSet("field-name", "username-error", true);
    validationState.name = true;
    checkAllFieldsValid();
    return true;
  }
}


/**
 * Handles the isUserExistByEmail workflow.
 * @function isUserExistByEmail
 */
async function isUserExistByEmail(inputEmail) {
  if (!inputEmail || !inputEmail.trim()) {
    handleErrorSet(
      "field-email",
      "email-error",
      false,
      "E-Mail cannot be empty"
    );
    validationState.email = false;
    checkAllFieldsValid();
    return false;
  }
  try {
    if (!validateEmailFormat(inputEmail)) {
      validationState.email = false;
      checkAllFieldsValid();
      return false;
    }
    const exists = await isUserEmailTaken(inputEmail);
    if (exists) {
      handleErrorSet(
        "field-email",
        "email-error",
        false,
        "E-Mail already exists!"
      );
      validationState.email = false;
      checkAllFieldsValid();
      return false;
    }
    newUser.email = inputEmail;
    handleErrorSet("field-email", "email-error", true);
    validationState.email = true;
    checkAllFieldsValid();
    return true;
  } catch (error) {
    console.error("Error validating email:", error);
    handleErrorSet(
      "field-email",
      "email-error",
      false,
      "Error validating email. Please try again."
    );
    validationState.email = false;
    checkAllFieldsValid();
    return false;
  }
}


/**
 * Handles the validateEmailFormat workflow.
 * @function validateEmailFormat
 */
function validateEmailFormat(inputEmail) {
  // RFC 5322 compliant email regex that handles most valid email formats
  const emailRegex =
    /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;
  if (!emailRegex.test(inputEmail)) {
    handleErrorSet(
      "field-email",
      "email-error",
      false,
      "Please enter a valid E-Mail!"
    );
    return false;
  }
  return true;
}


/**
 * Handles the toggleCheckBox workflow.
 * @function toggleCheckBox
 */
function toggleCheckBox(event) {
  if (event.target.tagName === "A") {
    return;
  }
  let checkbox = document.getElementById("privacy-checkbox");
  if (checkbox.disabled) {
    event.preventDefault();
    return;
  }
  setTimeout(function () {
    let signUpButton = document.getElementById("btn-signup");
    if (checkbox.checked) {
      signUpButton.disabled = false;
    } else {
      signUpButton.disabled = true;
    }
  }, 0);
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

  if (isValid) {
    el.classList.add("d-none");
    el.textContent = "";
    el.innerHTML = "";
  } else {
    el.classList.remove("d-none");
    if (elementId === "password-tooltip") {
      el.innerHTML = message;
    } else {
      el.textContent = message;
    }
  }
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

  if (status) {
    fieldInput.classList.add("valid-input");
  } else {
    fieldInput.classList.add("invalid-input");
  }
}


/**
 * Checks if all input fields are valid and enables the checkbox if so
 */
function checkAllFieldsValid() {
  const allValid = validationState.name && 
                   validationState.email && 
                   validationState.password && 
                   validationState.confirmPassword;
  
  const checkbox = document.getElementById("privacy-checkbox");
  if (checkbox) {
    checkbox.disabled = !allValid;
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
