/**
 * @fileoverview Password visibility toggles and matching helpers.
 * Handles masked input rendering and confirm-password comparison.
 * @version 1.0.0
 * @author Join-1325 Development Team
 */
let realPassword = "";
let passwordVisible = false;

let realConfirmPassword = "";
let confirmVisible = false;

function toggleVisibilityIcon() {
  const icon = document.getElementById("password-icon");
  if (realPassword.length === 0) {
    icon.src = "../assets/icon/sign/lock.svg";
    passwordVisible = false;
  } else {
    icon.src = passwordVisible
      ? "../assets/icon/sign/visibility.svg"
      : "../assets/icon/sign/visibility-off.svg";
  }
}


function onPasswordIconClick() {
  const input = document.getElementById("input-password");
  if (realPassword.length === 0) return;

  passwordVisible = !passwordVisible;
  hideWord(input, passwordVisible, realPassword);
  toggleVisibilityIcon();
}


function updateConfirmIconByState() {
  const icon = document.getElementById("confirm-password-icon");
  if (realConfirmPassword.length === 0) {
    icon.src = "../assets/icon/sign/lock.svg";
    confirmVisible = false;
  } else {
    icon.src = confirmVisible
      ? "../assets/icon/sign/visibility.svg"
      : "../assets/icon/sign/visibility-off.svg";
  }
}


function onInputConfirmPassword(input) {
  const inputConfirmWord = input.value;
  realConfirmPassword = updateVariable(inputConfirmWord, realConfirmPassword);
  hideWord(input, confirmVisible, realConfirmPassword);
  updateConfirmIconByState();
}


function onClickConfirmPasswordIcon() {
  const input = document.getElementById("input-password-confirm");
  confirmVisible = !confirmVisible;
  updateConfirmIconByState();
  hideWord(input, confirmVisible, realConfirmPassword);
}


function isPasswordMatching() {
  if (!realConfirmPassword) return;
  if (realPassword === realConfirmPassword) {
    handleErrorSet(
      "field-password-confirm",
      "confirm-password",
      true
    );
    if (typeof validationState !== 'undefined') {
      validationState.confirmPassword = true;
      checkAllFieldsValid();
    }
  } else {
    handleErrorSet(
      "field-password-confirm",
      "confirm-password",
      false,
      "Passwords do not match!"
    );
    if (typeof validationState !== 'undefined') {
      validationState.confirmPassword = false;
      checkAllFieldsValid();
    }
  }
}


function updateVariable(inputWord, realVar) {
  if (inputWord.length > realVar.length) {
    const added = inputWord.slice(realVar.length);
    realVar += added;
  } else if (inputWord.length < realVar.length) {
    realVar = realVar.slice(0, inputWord.length);
  }
  return realVar;
}


function hideWord(inputWord, isVisible, realWord) {
  if (realWord.length === 0) return isVisible;
  inputWord.value = isVisible ? realWord : "*".repeat(realWord.length);
  return isVisible;
}


function onPasswordInput(input) {
  const inputPassword = input.value;
  realPassword = updateVariable(inputPassword, realPassword);
  hideWord(input, passwordVisible, realPassword);
  toggleVisibilityIcon();
  setBorderColor("field-password", false);
  validatePasswordTooltip(realPassword);
}


function onPasswordBlur(inPassword) {
  if (checkPasswordRules(inPassword)) {
    // Save the real password to newUser object
    newUser.password = realPassword;
    handleErrorSet("field-password", "password-tooltip", true);
    if (typeof validationState !== 'undefined') {
      validationState.password = true;
      checkAllFieldsValid();
    }
  } else {
    handleErrorSet("field-password", "password-tooltip", false);
    if (typeof validationState !== 'undefined') {
      validationState.password = false;
      checkAllFieldsValid();
    }
  }
}


function validatePasswordTooltip(inputPassword) {
  const rules = checkPasswordRules(inputPassword);
  const msg = buildPasswordMessage(rules);
  const isValid = isPasswordValid(rules);
  
  handleErrorSet(
    "field-password",
    "password-tooltip",
    isValid,
    isValid ? "" : msg
  );
  
  // Update validation state
  if (typeof validationState !== 'undefined') {
    validationState.password = isValid;
    checkAllFieldsValid();
  }
  
  // Set HTML content directly for password tooltip
  if (!isValid) {
    const tooltipElement = document.getElementById("password-tooltip");
    if (tooltipElement) {
      tooltipElement.innerHTML = msg;
    }
  }
}


function isPasswordValid(rules) {
  return rules.minLength && rules.hasLower && rules.hasNumber;
}


function buildPasswordMessage(rules) {
  return`<span class="${rules.minLength ? "valid" : "invalid"}">
                At least 8 characters
              </span><br>
<span class="${rules.hasLower ? "valid" : "invalid"}">
                At least one lowercase letter
              </span><br><span class="${rules.hasNumber ? "valid" : "invalid"}">
                At least one number
              </span><br>`;
}


function checkPasswordRules(password) {
  return {
    minLength: password.length > 7,
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };
}
