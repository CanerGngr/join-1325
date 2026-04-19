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

/**
 * Handles the toggleVisibilityIcon workflow.
 * @function toggleVisibilityIcon
 */
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


/**
 * Handles the onPasswordIconClick workflow.
 * @function onPasswordIconClick
 */
function onPasswordIconClick() {
  const input = document.getElementById("input-password");
  if (realPassword.length === 0) return;

  const caretPosition = input ? input.selectionStart : null;
  passwordVisible = !passwordVisible;
  hideWord(input, passwordVisible, realPassword, caretPosition);
  toggleVisibilityIcon();
}


/**
 * Handles the updateConfirmIconByState workflow.
 * @function updateConfirmIconByState
 */
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


/**
 * Handles the onInputConfirmPassword workflow.
 * @function onInputConfirmPassword
 */
function onInputConfirmPassword(input, inputEvent) {
  const currentDisplay = input.value;
  const previousDisplay = confirmVisible ? realConfirmPassword : "*".repeat(realConfirmPassword.length);
  const caretPosition = input.selectionStart;
  realConfirmPassword = updateRealValueFromInput(
    realConfirmPassword,
    previousDisplay,
    currentDisplay,
    inputEvent,
    caretPosition
  );
  hideWord(input, confirmVisible, realConfirmPassword, caretPosition);
  updateConfirmIconByState();
}


/**
 * Handles the onClickConfirmPasswordIcon workflow.
 * @function onClickConfirmPasswordIcon
 */
function onClickConfirmPasswordIcon() {
  const input = document.getElementById("input-password-confirm");
  if (realConfirmPassword.length === 0) return;
  const caretPosition = input ? input.selectionStart : null;
  confirmVisible = !confirmVisible;
  hideWord(input, confirmVisible, realConfirmPassword, caretPosition);
  updateConfirmIconByState();
}


/**
 * Handles the isPasswordMatching workflow.
 * @function isPasswordMatching
 */
function isPasswordMatching() {
  if (!realConfirmPassword || !realConfirmPassword.trim()) {
    return setConfirmPasswordValidation(false, "Please confirm your password");
  }
  if (realPassword === realConfirmPassword) {
    return setConfirmPasswordValidation(true);
  }
  setConfirmPasswordValidation(false, "Passwords do not match!");
}


/**
 * Applies the confirm-password validation result to the UI and shared state.
 * @function setConfirmPasswordValidation
 */
function setConfirmPasswordValidation(isValid, errorMsg) {
  handleErrorSet("field-password-confirm", "confirm-password", isValid, errorMsg);
  if (typeof validationState !== 'undefined') {
    validationState.confirmPassword = isValid;
    checkAllFieldsValid();
  }
}


/**
 * Handles the updateVariable workflow.
 * @function updateVariable
 */
function updateVariable(inputWord, realVar) {
  if (inputWord.length > realVar.length) {
    const added = inputWord.slice(realVar.length);
    realVar += added;
  } else if (inputWord.length < realVar.length) {
    realVar = realVar.slice(0, inputWord.length);
  }
  return realVar;
}


/**
 * Handles the hideWord workflow.
 * @function hideWord
 */
function hideWord(inputWord, isVisible, realWord, caretPosition = null) {
  if (!inputWord) return isVisible;
  inputWord.value = isVisible ? realWord : "*".repeat(realWord.length);

  if (caretPosition !== null && document.activeElement === inputWord) {
    const safeCaret = Math.max(0, Math.min(caretPosition, inputWord.value.length));
    inputWord.setSelectionRange(safeCaret, safeCaret);
  }
  return isVisible;
}


/**
 * Handles the onPasswordInput workflow.
 * @function onPasswordInput
 */
function onPasswordInput(input, inputEvent) {
  const currentDisplay = input.value;
  const previousDisplay = passwordVisible ? realPassword : "*".repeat(realPassword.length);
  const caretPosition = input.selectionStart;
  realPassword = updateRealValueFromInput(
    realPassword,
    previousDisplay,
    currentDisplay,
    inputEvent,
    caretPosition
  );
  hideWord(input, passwordVisible, realPassword, caretPosition);
  toggleVisibilityIcon();
  setBorderColor("field-password", false);
  validatePasswordTooltip(realPassword);
}


/**
 * Handles robust real-password updates for masked and visible input modes.
 * @function updateRealValueFromInput
 */
function updateRealValueFromInput(realValue, previousDisplay, currentDisplay, inputEvent, caretPosition) {
  const oldLen = realValue.length;
  const newLen = currentDisplay.length;
  const caret = typeof caretPosition === "number" ? caretPosition : newLen;
  const inputType = inputEvent.inputType;

  if (inputType.startsWith("delete")) {
    const removedCount = Math.max(0, oldLen - newLen);
    const start = Math.max(0, Math.min(caret, realValue.length));
    const end = Math.max(start, Math.min(start + removedCount, realValue.length));
    return realValue.slice(0, start) + realValue.slice(end);
  }

  if (inputType.startsWith("insert")) {
    const typedData = typeof inputEvent.data === "string"
      ? inputEvent.data
      : currentDisplay.slice(Math.max(0, caret - Math.max(0, newLen - oldLen)), caret);
    const start = Math.max(0, Math.min(caret - typedData.length, realValue.length));
    const removedCount = Math.max(0, oldLen + typedData.length - newLen);
    const end = Math.max(start, Math.min(start + removedCount, realValue.length));
    return realValue.slice(0, start) + typedData + realValue.slice(end);
  }

  return updateRealValueByDisplayDiff(previousDisplay, currentDisplay, realValue);
}


/**
 * Handles the onPasswordBlur workflow.
 * @function onPasswordBlur
 */
function onPasswordBlur(inPassword) {
  const rules = checkPasswordRules(realPassword);
  const isValid = isPasswordValid(rules);

  if (isValid) {
    // Save the real password to newUser object
    newUser.password = realPassword;
    handleErrorSet("field-password", "password-tooltip", true);
    if (typeof validationState !== 'undefined') {
      validationState.password = true;
      checkAllFieldsValid();
    }
  } else {
    const msg = buildPasswordMessage(rules);
    handleErrorSet("field-password", "password-tooltip", false, msg);
    const tooltipElement = document.getElementById("password-tooltip");
    if (tooltipElement) {
      tooltipElement.innerHTML = msg;
    }
    if (typeof validationState !== 'undefined') {
      validationState.password = false;
      checkAllFieldsValid();
    }
  }
}


/**
 * Handles the validatePasswordTooltip workflow.
 * @function validatePasswordTooltip
 */
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


/**
 * Handles the isPasswordValid workflow.
 * @function isPasswordValid
 */
function isPasswordValid(rules) {
  return rules.minLength && rules.hasLower && rules.hasNumber;
}


/**
 * Handles the buildPasswordMessage workflow.
 * @function buildPasswordMessage
 */
function buildPasswordMessage(rules) {
  return `<span class="${rules.minLength ? "valid" : "invalid"}">Min. 8 Zeichen</span>, <span class="${rules.hasLower ? "valid" : "invalid"}">Groß-/Kleinbuchstaben</span>, <span class="${rules.hasNumber ? "valid" : "invalid"}">& Zahl</span>`;
}

/**
 * Handles the checkPasswordRules workflow.
 * @function checkPasswordRules
 */
function checkPasswordRules(password) {
  return {
    minLength: password.length > 7,
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };
}
