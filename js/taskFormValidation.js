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
    categoryInput: document.getElementById(isEditMode ? "edit-category-hidden" : "category-hidden"),
    titleGroup: document.getElementById(isEditMode ? "edit-title-form-group" : "title-form-group"),
    dateGroup: document.getElementById(isEditMode ? "edit-date-form-group" : "date-form-group"),
    categoryGroup: document.getElementById(isEditMode ? "edit-category-form-group" : "category-form-group"),
  };
}


/**
 * Clears task form error state for add or edit mode.
 * @param {boolean} isEditMode - True for edit task form, false for add task form.
 */
function clearTaskFormErrors(isEditMode) {
  const { titleGroup, dateGroup, categoryGroup } = getTaskValidationElements(isEditMode);
    titleGroup.classList.remove("error");
    dateGroup.classList.remove("error");
    categoryGroup.classList.remove("error");
}


/**
 * Validates the complete task form for add or edit mode.
 * @param {boolean} isEditMode - True for edit task form, false for add task form.
 * @returns {boolean} True when all required fields are valid.
 */
function validateTaskForm(isEditMode) {
  const isTitleValid = validateTaskTitleField(isEditMode);
  const isDateValid = validateTaskDateField(isEditMode);
  const isCategoryValid = validateTaskCategoryField(isEditMode);
  return isTitleValid && isDateValid && isCategoryValid;
}


/**
 * Validates task title field for add or edit mode.
 * @param {boolean} isEditMode - True for edit task form, false for add task form.
 * @returns {boolean} True when title has content.
 */
function validateTaskTitleField(isEditMode) {
  const { titleInput, titleGroup } = getTaskValidationElements(isEditMode);
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
  const hasValue = dateInput.value !== "";
  dateGroup.classList.toggle("error", !hasValue);
  return hasValue;
}


/**
 * Validates task category field for add or edit mode.
 * @param {boolean} isEditMode - True for edit task form, false for add task form.
 * @returns {boolean} True when a category is selected.
 */
function validateTaskCategoryField(isEditMode) {
  const { categoryInput, categoryGroup } = getTaskValidationElements(isEditMode);
  const hasValue = categoryInput.value.trim() !== "";
  categoryGroup.classList.toggle("error", !hasValue);
  return hasValue;
}
