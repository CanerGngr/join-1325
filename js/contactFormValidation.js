/**
 * Contact form validation helpers for add and edit contact overlays.
 */

/**
 * Returns the relevant DOM elements for contact form validation.
 * @param {boolean} isEditMode - True for edit contact form, false for add contact form.
 * @returns {{nameInput: HTMLElement|null, emailInput: HTMLElement|null, phoneInput: HTMLElement|null, nameGroup: HTMLElement|null, emailGroup: HTMLElement|null, phoneGroup: HTMLElement|null}}
 */
function getContactValidationElements(isEditMode) {
  return {
    nameInput: document.getElementById(isEditMode ? "edit-contact-name" : "add-contact-name"),
    emailInput: document.getElementById(isEditMode ? "edit-contact-email" : "add-contact-email"),
    phoneInput: document.getElementById(isEditMode ? "edit-contact-phone" : "add-contact-phone"),
    nameGroup: document.getElementById(isEditMode ? "edit-contact-name-group" : "add-contact-name-group"),
    emailGroup: document.getElementById(isEditMode ? "edit-contact-email-group" : "add-contact-email-group"),
    phoneGroup: document.getElementById(isEditMode ? "edit-contact-phone-group" : "add-contact-phone-group"),
  };
}


/**
 * Clears all contact form error states.
 * @param {boolean} isEditMode - True for edit contact form, false for add contact form.
 */
function clearContactFormErrors(isEditMode) {
  const { nameGroup, emailGroup, phoneGroup } = getContactValidationElements(isEditMode);
  nameGroup.classList.remove("error");
  emailGroup.classList.remove("error");
  phoneGroup.classList.remove("error");
}


/**
 * Validates the complete contact form.
 * @param {boolean} isEditMode - True for edit contact form, false for add contact form.
 * @returns {boolean} True when all required fields are valid.
 */
function validateContactForm(isEditMode) {
  const isNameValid = validateContactNameField(isEditMode);
  const isEmailValid = validateContactEmailField(isEditMode);
  const isPhoneValid = validateContactPhoneField(isEditMode);
  return isNameValid && isEmailValid && isPhoneValid;
}


/**
 * Validates the contact name field.
 * @param {boolean} isEditMode - True for edit contact form, false for add contact form.
 * @returns {boolean} True when name has content.
 */
function validateContactNameField(isEditMode) {
  const { nameInput, nameGroup } = getContactValidationElements(isEditMode);
  const hasValue = nameInput.value.trim() !== "";
  nameGroup.classList.toggle("error", !hasValue);
  return hasValue;
}


/**
 * Validates the contact email field.
 * @param {boolean} isEditMode - True for edit contact form, false for add contact form.
 * @returns {boolean} True when email is valid.
 */
function validateContactEmailField(isEditMode) {
  const { emailInput, emailGroup } = getContactValidationElements(isEditMode);
  const value = emailInput.value.trim();
  const isValid = value !== "" && emailInput.checkValidity();
  emailGroup.classList.toggle("error", !isValid);
  return isValid;
}


/**
 * Validates the contact phone field.
 * @param {boolean} isEditMode - True for edit contact form, false for add contact form.
 * @returns {boolean} True when phone has content.
 */
function validateContactPhoneField(isEditMode) {
  const { phoneInput, phoneGroup } = getContactValidationElements(isEditMode);
  const hasValue = phoneInput.value.trim() !== "";
  phoneGroup.classList.toggle("error", !hasValue);
  return hasValue;
}
