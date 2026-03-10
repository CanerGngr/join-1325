/**
 * Shared task form validation helpers for add and edit modes.
 */

/**
 * Returns all required DOM elements for task form validation based on mode.
 * @param {boolean} isEditMode - True for edit task form, false for add task form.
 * @returns {{titleInput: HTMLElement|null, dateInput: HTMLElement|null, titleGroup: HTMLElement|null, dateGroup: HTMLElement|null}}
 */
function getTaskValidationElements(isEditMode) {
  return {
    titleInput: document.getElementById(isEditMode ? "edit-task-title" : "task-title"),
    dateInput: document.getElementById(isEditMode ? "edit-task-date" : "task-date"),
    titleGroup: document.getElementById(isEditMode ? "edit-title-form-group" : "title-form-group"),
    dateGroup: document.getElementById(isEditMode ? "edit-date-form-group" : "date-form-group"),
  };
}

/**
 * Clears task form error state for add or edit mode.
 * @param {boolean} isEditMode - True for edit task form, false for add task form.
 */
function clearTaskFormErrors(isEditMode) {
  const { titleGroup, dateGroup } = getTaskValidationElements(isEditMode);

  if (titleGroup) {
    titleGroup.classList.remove("error");
  }
  if (dateGroup) {
    dateGroup.classList.remove("error");
  }
}

/**
 * Validates the complete task form for add or edit mode.
 * @param {boolean} isEditMode - True for edit task form, false for add task form.
 * @returns {boolean} True when all required fields are valid.
 */
function validateTaskForm(isEditMode) {
  const isTitleValid = validateTaskTitleField(isEditMode);
  const isDateValid = validateTaskDateField(isEditMode);
  return isTitleValid && isDateValid;
}

/**
 * Validates task title field for add or edit mode.
 * @param {boolean} isEditMode - True for edit task form, false for add task form.
 * @returns {boolean} True when title has content.
 */
function validateTaskTitleField(isEditMode) {
  const { titleInput, titleGroup } = getTaskValidationElements(isEditMode);
  if (!titleInput || !titleGroup) {
    return true;
  }

  const hasValue = titleInput.value.trim() !== "";
  titleGroup.classList.toggle("error", !hasValue);
  return hasValue;
}

/**
 * Validates task due date field for add or edit mode.
 * @param {boolean} isEditMode - True for edit task form, false for add task form.
 * @returns {boolean} True when due date has content.
 */
function validateTaskDateField(isEditMode) {
  const { dateInput, dateGroup } = getTaskValidationElements(isEditMode);
  if (!dateInput || !dateGroup) {
    return true;
  }

  const hasValue = dateInput.value !== "";
  dateGroup.classList.toggle("error", !hasValue);
  return hasValue;
}

/**
 * Blur handler for task title field.
 * @param {boolean} isEditMode - True for edit task form, false for add task form.
 */
function handleTaskTitleBlur(isEditMode) {
  validateTaskTitleField(isEditMode);
}

/**
 * Blur handler for task due date field.
 * @param {boolean} isEditMode - True for edit task form, false for add task form.
 */
function handleTaskDateBlur(isEditMode) {
  validateTaskDateField(isEditMode);
}
