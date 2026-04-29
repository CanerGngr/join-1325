/**
 * @fileoverview Central HTML template functions.
 * Contains pure HTML string builders used across the app.
 * @version 1.0.0
 * @author Join-1325 Development Team
 */


/**
 * Returns HTML for an assignee avatar chip.
 * @function getAssigneeAvatarTemplate
 */
function getAssigneeAvatarTemplate(userName) {
  let initials = getInitials(userName);
  let avatarColor = getAvatarColor(userName);
  return `<div class="user-avatar-sm" style="background-color: ${avatarColor};">${initials}</div>`;
}


/**
 * Returns HTML for the "+N" overflow chip when more assignees are hidden.
 * @function getAssigneeOverflowTemplate
 */
function getAssigneeOverflowTemplate(hiddenCount) {
  return `<div class="user-avatar-sm more-assignees">+${hiddenCount}</div>`;
}


/**
 * Returns HTML for a single assigned-to dropdown item.
 * @function getDropdownItemTemplate
 */
function getDropdownItemTemplate(data) {
  return `
    <div class="dropdown-item">
      <label class="d-flex dropdown-item-label custom-checkbox" for="${data.userId}">
        <div class="user-avatar-sm" style="background-color: ${data.avatarColor};">${data.initials}</div>
        ${data.name}
        <input type="checkbox" class="checkbox-masked" id="${data.userId}" value="${data.name}" ${data.checkedAttribute} onchange="toggleUserSelection('${data.name}', event, ${data.modeParam})">
      </label>
    </div>
  `;
}


/**
 * Returns HTML for the alphabet header in the contact list.
 * @function getAlphabetHeaderTemplate
 */
function getAlphabetHeaderTemplate(letter) {
  return `
        <div class="alphabet-header">
            <h3>${letter}</h3>
        </div>
        <span class="divider"></span>
    `;
}


/**
 * Returns HTML for a single contact card in the contact list.
 * @function getContactCardTemplate
 */
function getContactCardTemplate(contact, index) {
  const activeClass = activeContactIndex === index ? "active" : "";
  const avatarColor = getAvatarColor(contact.name);
  const initials = getInitials(contact.name);
  return `
            <div class="contact-card ${activeClass}" onclick="showContactDetails(${index})">
                <div class="contact-card-content">
                  <div class="user-avatar-sm" style="background-color: ${avatarColor};">
                    <div>${initials}</div>
                  </div>
                  <div class="contact-info">
                      <p class="contact-name">${contact.name}</p>
                      <p class="contact-email">${contact.email}</p>
                  </div>
                </div>
            </div>
        `;
}


/**
 * Returns HTML for the detailed contact view.
 * @function getContactDetailsTemplate
 */
function getContactDetailsTemplate(contact, index, avatarColor, initials) {
  return `
        <h3 id="contact-header-title-mobile">Contact Information</h3>
        <div class="contact-header d-flex">
                <div class="user-avatar-lg details-avatar" style="background-color: ${avatarColor};">
                    <div class="avatar-content"><span class="avatar-initials">${initials}</span></div>
                </div>
                <div class="contact-header-title-desktop">
                    <h1>${contact.name}</h1>
                <div class="contact-header-details">
                  <div class="mobile-contact-actions" onclick="openDropdownMenuMobile(event)">
                    <img src="/assets/icon/contacts/contact-details-menu.svg" alt="Menu Icon" />
                    <div id="dropdown-menu-mobile" class="dropdown-menu-mobile">
                      <button onclick="editContact(${index})" class="text-btn-with-icon popup-btn">
                        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M2.49951 17H3.89951L12.5245 8.375L11.1245 6.975L2.49951 15.6V17ZM16.7995 6.925L12.5495 2.725L13.9495 1.325C14.3328 0.941667 14.8037 0.75 15.362 0.75C15.9203 0.75 16.3912 0.941667 16.7745 1.325L18.1745 2.725C18.5578 3.10833 18.7578 3.57083 18.7745 4.1125C18.7912 4.65417 18.6078 5.11667 18.2245 5.5L16.7995 6.925ZM15.3495 8.4L4.74951 19H0.499512V14.75L11.0995 4.15L15.3495 8.4Z" fill="#4589FF"/>
                        </svg>
                        <span>Edit</span>
                      </button>
                      <button onclick="deleteContact(${index})" class="text-btn-with-icon popup-btn">
                        <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3.49951 18C2.94951 18 2.47868 17.8042 2.08701 17.4125C1.69535 17.0208 1.49951 16.55 1.49951 16V3C1.21618 3 0.978678 2.90417 0.787012 2.7125C0.595345 2.52083 0.499512 2.28333 0.499512 2C0.499512 1.71667 0.595345 1.47917 0.787012 1.2875C0.978678 1.09583 1.21618 1 1.49951 1H5.49951C5.49951 0.716667 5.59535 0.479167 5.78701 0.2875C5.97868 0.0958333 6.21618 0 6.49951 0H10.4995C10.7828 0 11.0203 0.0958333 11.212 0.2875C11.4037 0.479167 11.4995 0.716667 11.4995 1H15.4995C15.7828 1 16.0203 1.09583 16.212 1.2875C16.4037 1.47917 16.4995 1.71667 16.4995 2C16.4995 2.28333 16.4037 2.52083 16.212 2.7125C16.0203 2.90417 15.7828 3 15.4995 3V16C15.4995 16.55 15.3037 17.0208 14.912 17.4125C14.5203 17.8042 14.0495 18 13.4995 18H3.49951ZM3.49951 3V16H13.4995V3H3.49951ZM5.49951 13C5.49951 13.2833 5.59535 13.5208 5.78701 13.7125C5.97868 13.9042 6.21618 14 6.49951 14C6.78285 14 7.02035 13.9042 7.21201 13.7125C7.40368 13.5208 7.49951 13.2833 7.49951 13V6C7.49951 5.71667 7.40368 5.47917 7.21201 5.2875C7.02035 5.09583 6.78285 5 6.49951 5C6.21618 5 5.97868 5.09583 5.78701 5.2875C5.59535 5.47917 5.49951 5.71667 5.49951 6V13ZM9.49951 13C9.49951 13.2833 9.59535 13.5208 9.78701 13.7125C9.97868 13.9042 10.2162 14 10.4995 14C10.7828 14 11.0203 13.9042 11.212 13.7125C11.4037 13.5208 11.4995 13.2833 11.4995 13V6C11.4995 5.71667 11.4037 5.47917 11.212 5.2875C11.0203 5.09583 10.7828 5 10.4995 5C10.2162 5 9.97868 5.09583 9.78701 5.2875C9.59535 5.47917 9.49951 5.71667 9.49951 6V13Z" fill="#4589FF"/>
                          </svg>
                          <span>Delete</span>
                      </button>
                    </div>
                  </div>
                  <div class="desktop-contact-actions">
                      <button onclick="editContact(${index})" class="text-btn-with-icon">
                          <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M2.49951 17H3.89951L12.5245 8.375L11.1245 6.975L2.49951 15.6V17ZM16.7995 6.925L12.5495 2.725L13.9495 1.325C14.3328 0.941667 14.8037 0.75 15.362 0.75C15.9203 0.75 16.3912 0.941667 16.7745 1.325L18.1745 2.725C18.5578 3.10833 18.7578 3.57083 18.7745 4.1125C18.7912 4.65417 18.6078 5.11667 18.2245 5.5L16.7995 6.925ZM15.3495 8.4L4.74951 19H0.499512V14.75L11.0995 4.15L15.3495 8.4Z" fill="#4589FF"/>
                          </svg>
                          Edit
                      </button>
                      <button onclick="deleteContact(${index})" class="text-btn-with-icon">
                          <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3.49951 18C2.94951 18 2.47868 17.8042 2.08701 17.4125C1.69535 17.0208 1.49951 16.55 1.49951 16V3C1.21618 3 0.978678 2.90417 0.787012 2.7125C0.595345 2.52083 0.499512 2.28333 0.499512 2C0.499512 1.71667 0.595345 1.47917 0.787012 1.2875C0.978678 1.09583 1.21618 1 1.49951 1H5.49951C5.49951 0.716667 5.59535 0.479167 5.78701 0.2875C5.97868 0.0958333 6.21618 0 6.49951 0H10.4995C10.7828 0 11.0203 0.0958333 11.212 0.2875C11.4037 0.479167 11.4995 0.716667 11.4995 1H15.4995C15.7828 1 16.0203 1.09583 16.212 1.2875C16.4037 1.47917 16.4995 1.71667 16.4995 2C16.4995 2.28333 16.4037 2.52083 16.212 2.7125C16.0203 2.90417 15.7828 3 15.4995 3V16C15.4995 16.55 15.3037 17.0208 14.912 17.4125C14.5203 17.8042 14.0495 18 13.4995 18H3.49951ZM3.49951 3V16H13.4995V3H3.49951ZM5.49951 13C5.49951 13.2833 5.59535 13.5208 5.78701 13.7125C5.97868 13.9042 6.21618 14 6.49951 14C6.78285 14 7.02035 13.9042 7.21201 13.7125C7.40368 13.5208 7.49951 13.2833 7.49951 13V6C7.49951 5.71667 7.40368 5.47917 7.21201 5.2875C7.02035 5.09583 6.78285 5 6.49951 5C6.21618 5 5.97868 5.09583 5.78701 5.2875C5.59535 5.47917 5.49951 5.71667 5.49951 6V13ZM9.49951 13C9.49951 13.2833 9.59535 13.5208 9.78701 13.7125C9.97868 13.9042 10.2162 14 10.4995 14C10.7828 14 11.0203 13.9042 11.212 13.7125C11.4037 13.5208 11.4995 13.2833 11.4995 13V6C11.4995 5.71667 11.4037 5.47917 11.212 5.2875C11.0203 5.09583 10.7828 5 10.4995 5C10.2162 5 9.97868 5.09583 9.78701 5.2875C9.59535 5.47917 9.49951 5.71667 9.49951 6V13Z" fill="#4589FF"/>
                          </svg>
                          Delete
                      </button>
                  </div>
                </div>
                </div>
        </div>
        <h2 id="contact-header-title-desktop">Contact Information</h2>
        <div class="contact-details">
            <div>
              <h3>Email</h3>
              <a href="mailto:${contact.email}">${contact.email}</a>
            </div>
            <div>
              <h3>Phone</h3>
              <a href="tel:${contact.phone}">${contact.phone}</a>
            </div>
        </div>
        <button class="back-btn-mobile" onclick="backToContactList()" aria-label="Back" type="button"></button>
            `;
}


/**
 * Returns HTML for the edit-contact form body.
 * @function getEditContactFormTemplate
 */
function getEditContactFormTemplate(contact, avatarColor, initials) {
  return `
        <div class="contact-form-avatar user-avatar-lg " style="background-color: ${avatarColor};">
            <div class="avatar-content">${initials}</div>
        </div>
        <div class="form-group" id="edit-contact-name-group">
            <div class="input-icon-container">
                <input type="text" id="edit-contact-name" onblur="validateContactNameField(true)" value="${
                  contact.name
                }" required />
                <img src="/assets/icon/sign/person.svg" alt="name" class="overlay-image" />
            </div>
            <div class="error-message">This field is required</div>
        </div>
        <div class="form-group" id="edit-contact-email-group">
            <div class="input-icon-container">
                <input type="email" id="edit-contact-email" onblur="validateContactEmailField(true)" value="${
                  contact.email
                }" required />
                <img src="/assets/icon/sign/mail.svg" alt="email" class="overlay-image" />
            </div>
            <div class="error-message">Please enter a valid email</div>
        </div>
        <div class="form-group" id="edit-contact-phone-group">
            <div class="input-icon-container">
                <input type="text" id="edit-contact-phone" onblur="validateContactPhoneField(true)" oninput="validatePhoneInput(true)" value="${
                  contact.phone
                }" required />
                <img src="/assets/icon/sign/phone.svg" alt="phone" class="overlay-image" />
            </div>
            <div class="error-message">This field is required</div>
        </div>
        <div class="form-buttons">
            <button type="button" onclick="deleteContact(${contacts.indexOf(
              contact
            )})" class="btn-secondary-with-icon">Delete</button>
            <button type="submit" class="btn-with-icon">Save
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.55021 9.15L14.0252 0.675C14.2252 0.475 14.4627 0.375 14.7377 0.375C15.0127 0.375 15.2502 0.475 15.4502 0.675C15.6502 0.875 15.7502 1.1125 15.7502 1.3875C15.7502 1.6625 15.6502 1.9 15.4502 2.1L6.25021 11.3C6.05021 11.5 5.81687 11.6 5.55021 11.6C5.28354 11.6 5.05021 11.5 4.85021 11.3L0.550207 7C0.350207 6.8 0.254374 6.5625 0.262707 6.2875C0.27104 6.0125 0.375207 5.775 0.575207 5.575C0.775207 5.375 1.01271 5.275 1.28771 5.275C1.56271 5.275 1.80021 5.375 2.00021 5.575L5.55021 9.15Z" fill="white"/>
                </svg>
            </button>
        </div>
    `;
}


/**
 * Returns HTML for a single user avatar used in the edit task form.
 * @function createEditUserAvatarHTML
 */
function createEditUserAvatarHTML(fullName) {
  let initials = getInitials(fullName);
  let avatarColor = getAvatarColor(fullName);

  return `
    <div class="user-item">
      <div class="user-avatar-sm" style="background-color: ${avatarColor};">${initials}</div>
    </div>
  `;
}


/**
 * Returns HTML template for the edit-task form.
 * @function getEditTaskTemplate
 */
function getEditTaskTemplate(task) {
  let assignedUsersHTML = generateAssignedUsersEditHTML(task.assignedTo || []);
  return `
    <div class="details-card">
      <div class="details-header">
        <svg class="btn-close-white" onclick="toggleOverlay('#details-overlay')" width="32" height="32" viewBox="0 0 32 32" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16.0001 17.8642L9.46673 24.389C9.22229 24.6331 8.91118 24.7552 8.5334 24.7552C8.15562 24.7552 7.84451 24.6331 7.60007 24.389C7.35562 24.1449 7.2334 23.8342 7.2334 23.4569C7.2334 23.0796 7.35562 22.7689 7.60007 22.5248L14.1334 16L7.60007 9.47527C7.35562 9.23115 7.2334 8.92045 7.2334 8.54316C7.2334 8.16588 7.35562 7.85518 7.60007 7.61106C7.84451 7.36693 8.15562 7.24487 8.5334 7.24487C8.91118 7.24487 9.22229 7.36693 9.46673 7.61106L16.0001 14.1358L22.5334 7.61106C22.7778 7.36693 23.089 7.24487 23.4667 7.24487C23.8445 7.24487 24.1556 7.36693 24.4001 7.61106C24.6445 7.85518 24.7667 8.16588 24.7667 8.54316C24.7667 8.92045 24.6445 9.23115 24.4001 9.47527L17.8667 16L24.4001 22.5248C24.6445 22.7689 24.7667 23.0796 24.7667 23.4569C24.7667 23.8342 24.6445 24.1449 24.4001 24.389C24.1556 24.6331 23.8445 24.7552 23.4667 24.7552C23.089 24.7552 22.7778 24.6331 22.5334 24.389L16.0001 17.8642Z"
            fill="#4589FF" />
        </svg>
      </div>
      <form id="edit-task-form" class="task-form" onsubmit="submitEditTask(event, '${task.id}')">
            <div class="form-group" id="edit-title-form-group">
              <input
                type="text"
                class="form-input title-input"
                id="edit-task-title"
                name="task_title"
                placeholder="Enter a title"
                value="${task.title}"
                required
                onblur="handleTaskTitleBlur(true)"
              />
              <div class="error-message">This field is required</div>
            </div>

            <div class="form-group">
              <label for="task-description"
                >Description <span class="optional">(optional)</span></label
              >
              <textarea
                name="task_description"
                id="task-description"
                rows="4"
              >${task.description || ''}</textarea>
            </div>

            <div class="form-group" id="edit-date-form-group">
              <label for="task-date">Due date</label>
              <input
                type="date"
                class="form-input"
                name="due_date"
                id="edit-task-date"
                value="${task.dueDate}"
                onkeydown="return false"
                onblur="handleTaskDateBlur(true)"
              />
              <div class="error-message">This field is required</div>
            </div>

            <div class="form-group">
              <label>Priority</label>
              <div class="radio-to-btn d-flex">
                <input
                  id="edit-urgent-priority"
                  type="radio"
                  name="edit-priority"
                  value="Urgent"
                />
                <label for="edit-urgent-priority" class="urgent-priority">
                  Urgent
                  <svg
                    width="20"
                    height="15"
                    viewBox="0 0 20 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.9038 14.7547C18.6691 14.7551 18.4406 14.6803 18.2517 14.5412L9.99966 8.458L1.7476 14.5412C1.63175 14.6267 1.50017 14.6887 1.36037 14.7234C1.22057 14.7582 1.07528 14.7651 0.932817 14.7437C0.790349 14.7223 0.653485 14.6732 0.53004 14.599C0.406595 14.5247 0.298986 14.427 0.213357 14.3112C0.127727 14.1954 0.0657554 14.0639 0.0309788 13.9243C-0.00379784 13.7846 -0.010698 13.6394 0.0106721 13.497C0.0538312 13.2095 0.209522 12.9509 0.443493 12.7781L9.3476 6.20761C9.5363 6.06802 9.76488 5.99268 9.99966 5.99268C10.2344 5.99268 10.463 6.06802 10.6517 6.20761L19.5558 12.7781C19.7417 12.915 19.8796 13.1071 19.9498 13.327C20.0199 13.5469 20.0188 13.7833 19.9465 14.0025C19.8742 14.2216 19.7344 14.4124 19.5471 14.5475C19.3599 14.6826 19.1347 14.7551 18.9038 14.7547Z"
                      fill="#FF3D00"
                    />
                    <path
                      d="M18.9038 9.00568C18.6691 9.00609 18.4406 8.93124 18.2517 8.79214L9.99966 2.70898L1.74761 8.79214C1.51364 8.96495 1.22055 9.0378 0.932821 8.99468C0.645094 8.95155 0.386297 8.79597 0.213361 8.56218C0.0404254 8.32838 -0.0324824 8.03551 0.0106767 7.74799C0.0538357 7.46048 0.209526 7.20187 0.443498 7.02906L9.34761 0.458588C9.53631 0.318997 9.76488 0.243652 9.99966 0.243652C10.2344 0.243652 10.463 0.318997 10.6517 0.458588L19.5558 7.02906C19.7417 7.16598 19.8796 7.35809 19.9498 7.57797C20.0199 7.79785 20.0188 8.03426 19.9465 8.25344C19.8742 8.47262 19.7344 8.66338 19.5472 8.79847C19.3599 8.93356 19.1347 9.00608 18.9038 9.00568Z"
                      fill="#FF3D00"
                    />
                  </svg>
                </label>
                <input
                  id="edit-medium-priority"
                  type="radio"
                  name="edit-priority"
                  value="Medium"
                />
                <label for="edit-medium-priority" class="medium-priority">
                  Medium
                  <svg
                    width="20"
                    height="9"
                    viewBox="0 0 20 9"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.9036 8.22528H1.0954C0.804754 8.22528 0.52601 8.10898 0.320491 7.90197C0.114971 7.69495 -0.000488281 7.41419 -0.000488281 7.12143C-0.000488281 6.82867 0.114971 6.5479 0.320491 6.34089C0.52601 6.13388 0.804754 6.01758 1.0954 6.01758H18.9036C19.1943 6.01758 19.473 6.13388 19.6785 6.34089C19.8841 6.5479 19.9995 6.82867 19.9995 7.12143C19.9995 7.41419 19.8841 7.69495 19.6785 7.90197C19.473 8.10898 19.1943 8.22528 18.9036 8.22528Z"
                      fill="#FFA800"
                    />
                    <path
                      d="M18.9036 2.98211H1.0954C0.804754 2.98211 0.52601 2.86581 0.320491 2.6588C0.114971 2.45179 -0.000488281 2.17102 -0.000488281 1.87826C-0.000488281 1.5855 0.114971 1.30474 0.320491 1.09772C0.52601 0.890712 0.804754 0.774414 1.0954 0.774414L18.9036 0.774414C19.1943 0.774414 19.473 0.890712 19.6785 1.09772C19.8841 1.30474 19.9995 1.5855 19.9995 1.87826C19.9995 2.17102 19.8841 2.45179 19.6785 2.6588C19.473 2.86581 19.1943 2.98211 18.9036 2.98211Z"
                      fill="#FFA800"
                    />
                  </svg>
                </label>
                <input
                  id="edit-low-priority"
                  type="radio"
                  name="edit-priority"
                  value="Low"
                />
                <label for="edit-low-priority" class="low-priority">
                  Low
                  <svg
                    width="21"
                    height="15"
                    viewBox="0 0 21 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.4995 9.00614C10.2649 9.00654 10.0364 8.9317 9.84753 8.79262L0.944424 2.22288C0.828586 2.13733 0.730747 2.02981 0.656491 1.90647C0.582236 1.78313 0.53302 1.64638 0.511652 1.50404C0.468498 1.21655 0.541397 0.923717 0.714313 0.689945C0.88723 0.456173 1.146 0.300615 1.43369 0.257493C1.72139 0.21437 2.01444 0.287216 2.24839 0.460004L10.4995 6.54248L18.7506 0.460004C18.8665 0.374448 18.998 0.312529 19.1378 0.277782C19.2776 0.243035 19.4229 0.236141 19.5653 0.257493C19.7078 0.278844 19.8446 0.328025 19.9681 0.402225C20.0915 0.476425 20.1991 0.574193 20.2847 0.689945C20.3703 0.805697 20.4323 0.937168 20.4671 1.07685C20.5018 1.21653 20.5087 1.36169 20.4874 1.50404C20.466 1.64638 20.4168 1.78313 20.3425 1.90647C20.2683 2.02981 20.1704 2.13733 20.0546 2.22288L11.1515 8.79262C10.9626 8.9317 10.7341 9.00654 10.4995 9.00614Z"
                      fill="#7AE229"
                    />
                    <path
                      d="M10.4995 14.7547C10.2649 14.7551 10.0364 14.6802 9.84753 14.5412L0.944424 7.97142C0.710479 7.79863 0.554806 7.54005 0.511652 7.25257C0.468498 6.96509 0.541397 6.67225 0.714313 6.43848C0.88723 6.20471 1.146 6.04915 1.43369 6.00603C1.72139 5.96291 2.01444 6.03575 2.24839 6.20854L10.4995 12.291L18.7506 6.20854C18.9846 6.03575 19.2776 5.96291 19.5653 6.00603C19.853 6.04915 20.1118 6.20471 20.2847 6.43848C20.4576 6.67225 20.5305 6.96509 20.4874 7.25257C20.4442 7.54005 20.2885 7.79863 20.0546 7.97142L11.1515 14.5412C10.9626 14.6802 10.7341 14.7551 10.4995 14.7547Z"
                      fill="#7AE229"
                    />
                  </svg>
                </label>
              </div>
            </div>

            <div class="form-group" id="assigned-to-form-group">
              <label for="assigned-to-input-field">
                Assigned To <span class="optional">(optional)</span>
              </label>
              <div class="custom-dropdown">
                <div class="dropdown-input-container">
                  <input
                    type="text"
                    class="dropdown-input"
                    id="edit-assigned-to-input-field"
                    placeholder="Select contacts to assign"
                    oninput="searchContact('task-edit')"
                    onclick="toggleAssignedDropdown('task-edit', this.parentElement.parentElement)"
                  />
                  <button
                    type="button"
                    class="dropdown-toggle-btn"
                    onclick="toggleAssignedDropdown('task-edit', this.parentElement.parentElement)"
                  >
                    <img
                      src="/assets/icon/task/dropdown-arrow.svg"
                      alt="dropdown arrow"
                      class="dropdown-arrow"
                    />
                  </button>
                </div>
                <div class="dropdown-list d-none" id="edit-assigned-to-list">
                  <!-- Will be populated dynamically -->
                </div>
                </div>
                <div class="assignees" id="edit-assignees-container">
                  ${assignedUsersHTML}
              </div>
            </div>
            <div class="form-group">
              <label for="add-subtask"
                >Subtasks <span class="optional">(optional)</span></label
              >
              <div class="subtask-input-container">
                <input
                  type="text"
                  class="form-input"
                  name="subtasks"
                  id="edit-add-subtask"
                  class="container-with-form-btn-group"
                  placeholder="Add new subtask"
                />
                <div class="form-btn-group">
                  <button type="button" class="form-btn-round">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 13.4L7.09999 18.3C6.91665 18.4834 6.68332 18.575 6.39999 18.575C6.11665 18.575 5.88332 18.4834 5.69999 18.3C5.51665 18.1167 5.42499 17.8834 5.42499 17.6C5.42499 17.3167 5.51665 17.0834 5.69999 16.9L10.6 12L5.69999 7.10005C5.51665 6.91672 5.42499 6.68338 5.42499 6.40005C5.42499 6.11672 5.51665 5.88338 5.69999 5.70005C5.88332 5.51672 6.11665 5.42505 6.39999 5.42505C6.68332 5.42505 6.91665 5.51672 7.09999 5.70005L12 10.6L16.9 5.70005C17.0833 5.51672 17.3167 5.42505 17.6 5.42505C17.8833 5.42505 18.1167 5.51672 18.3 5.70005C18.4833 5.88338 18.575 6.11672 18.575 6.40005C18.575 6.68338 18.4833 6.91672 18.3 7.10005L13.4 12L18.3 16.9C18.4833 17.0834 18.575 17.3167 18.575 17.6C18.575 17.8834 18.4833 18.1167 18.3 18.3C18.1167 18.4834 17.8833 18.575 17.6 18.575C17.3167 18.575 17.0833 18.4834 16.9 18.3L12 13.4Z"
                        fill="#4589FF"
                      />
                    </svg>
                  </button>
                  <div class="vertical-divider"></div>
                  <button
                    type="button"
                    class="form-btn-round"
                    onclick="addSubtask('task-edit')"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.55002 15.15L18.025 6.675C18.225 6.475 18.4625 6.375 18.7375 6.375C19.0125 6.375 19.25 6.475 19.45 6.675C19.65 6.875 19.75 7.1125 19.75 7.3875C19.75 7.6625 19.65 7.9 19.45 8.1L10.25 17.3C10.05 17.5 9.81669 17.6 9.55002 17.6C9.28336 17.6 9.05002 17.5 8.85002 17.3L4.55002 13C4.35002 12.8 4.25419 12.5625 4.26252 12.2875C4.27086 12.0125 4.37502 11.775 4.57502 11.575C4.77502 11.375 5.01252 11.275 5.28752 11.275C5.56252 11.275 5.80002 11.375 6.00002 11.575L9.55002 15.15Z"
                        fill="#4589FF"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <ul id="edit-subtask-list" class="subtask-list">
                ${task.subtasks && task.subtasks.length > 0
                  ? task.subtasks
                      .map((subtask, index) =>
                    getSubtaskItemTemplate(index, subtask.text)
                  )
                  .join("")
                  : ""}
              </ul>
            </div>
            <div class="d-flex flex-end">
              <button type="submit" class="btn-with-icon save-task-button">Ok
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.55021 15.15L18.0252 6.675C18.2252 6.475 18.4627 6.375 18.7377 6.375C19.0127 6.375 19.2502 6.475 19.4502 6.675C19.6502 6.875 19.7502 7.1125 19.7502 7.3875C19.7502 7.6625 19.6502 7.9 19.4502 8.1L10.2502 17.3C10.0502 17.5 9.81687 17.6 9.55021 17.6C9.28354 17.6 9.05021 17.5 8.85021 17.3L4.55021 13C4.35021 12.8 4.25437 12.5625 4.26271 12.2875C4.27104 12.0125 4.37521 11.775 4.57521 11.575C4.77521 11.375 5.01271 11.275 5.28771 11.275C5.56271 11.275 5.80021 11.375 6.00021 11.575L9.55021 15.15Z" fill="white"/>
                </svg>
              </button>
            </div>
          </form>
    </div>
        `;
}


/**
 * Returns HTML for a task card on the Kanban board.
 * @function getTaskCardTemplate
 */
function getTaskCardTemplate(
  task,
  assignedUsersHTML,
  categoryId,
  priorityIcon,
  priorityLabel,
  subtaskData,
) {
  let { subtaskProgress, totalSubtasks, progressInPercent } = subtaskData;

  return `
    <div class="task-card" draggable="true" data-task-id="${task.id || ""}"
         ondragstart="handleDragStart(event, this)"
         ondragend="handleDragEnd(this)"
         oncontextmenu="return false"
         ontouchstart="handleTouchStart(event, this)"
         ontouchmove="handleTouchMove(event)"
         ontouchend="handleTouchEnd(event)"
         onclick="showTaskDetails('${task.id || ""}')">
      <div id="${categoryId}" class="ticket-label">${task.category || "User Story"}</div>
      <div class="task-title">${task.title || "Untitled Task"}</div>
      <div class="task-description">${task.description || ""}</div>
      <div class="subtask-container">

        ${
          totalSubtasks > 0
            ? `
              <div class="progress-container d-flex">
                <div class="progress-bar" style="width: ${progressInPercent}%;"></div>
              </div>
              <div class="task-subtasks">${subtaskProgress}</div>
              `
            : ""
        }
      </div>
      <div class="task-footer d-flex">
        <div class="task-users">
          ${assignedUsersHTML}
        </div>
        <div class="task-priority">
          <img src="${priorityIcon}" alt="${priorityLabel}" class="priority-icon">
        </div>
      </div>
    </div>
  `;
}


/**
 * Returns HTML for a single assigned user item in task details.
 * @function createUserItemHTML
 */
function createUserItemHTML(fullName) {
  let initials = getInitials(fullName);
  let avatarColor = getAvatarColor(fullName);

  return `
    <div class="user-item">
      <div class="user-avatar-sm" style="background-color: ${avatarColor};">${initials}</div>
      <span class="user-name">${fullName}</span>
    </div>
  `;
}


/**
 * Returns HTML for the task-details overlay.
 * @function createDetailsTemplate
 */
function createDetailsTemplate(
  task,
  categoryId,
  subtasksHTML,
  assignedUsersHTML,
  priorityIcon,
  priorityLabel,
) {
  return `
    <div class="details-card">
      <div class="details-header">
        <div id="${categoryId}" class="ticket-label">${task.category || "User Story"}</div>
        <svg class="btn-close-white" onclick="toggleOverlay('#details-overlay')" width="32" height="32" viewBox="0 0 32 32" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M16.0001 17.8642L9.46673 24.389C9.22229 24.6331 8.91118 24.7552 8.5334 24.7552C8.15562 24.7552 7.84451 24.6331 7.60007 24.389C7.35562 24.1449 7.2334 23.8342 7.2334 23.4569C7.2334 23.0796 7.35562 22.7689 7.60007 22.5248L14.1334 16L7.60007 9.47527C7.35562 9.23115 7.2334 8.92045 7.2334 8.54316C7.2334 8.16588 7.35562 7.85518 7.60007 7.61106C7.84451 7.36693 8.15562 7.24487 8.5334 7.24487C8.91118 7.24487 9.22229 7.36693 9.46673 7.61106L16.0001 14.1358L22.5334 7.61106C22.7778 7.36693 23.089 7.24487 23.4667 7.24487C23.8445 7.24487 24.1556 7.36693 24.4001 7.61106C24.6445 7.85518 24.7667 8.16588 24.7667 8.54316C24.7667 8.92045 24.6445 9.23115 24.4001 9.47527L17.8667 16L24.4001 22.5248C24.6445 22.7689 24.7667 23.0796 24.7667 23.4569C24.7667 23.8342 24.6445 24.1449 24.4001 24.389C24.1556 24.6331 23.8445 24.7552 23.4667 24.7552C23.089 24.7552 22.7778 24.6331 22.5334 24.389L16.0001 17.8642Z"
          fill="#4589FF" />
        </svg>
      </div>
      <div class="details-body">
        <h2 class="details-title">${task.title}</h2>
        <p class="details-description">${task.description || ""}</p>
        <div class="details-due-date">
          <h3>Due Date:</h3>
          <p>${task.dueDate || "No due date"}</p>
        </div>
        <div class="details-priority">
          <h3>Priority:</h3>
          <div class="task-priority">
          <span>${priorityLabel}</span>
          <img src="${priorityIcon}" alt="${priorityLabel}" class="priority-icon">
          </div>
        </div>
        <div class="details-assigned">
          <h3>Assigned To:</h3>
          <div class="task-users details">
            ${assignedUsersHTML || "<p>No assigned users</p>"}
          </div>
        </div>
        <div class="details-subtasks">
          <h3>Subtasks</h3>
          <div class="subtask-content">
            ${subtasksHTML || "<li>No subtasks</li>"}
          </div>
        </div>
        <div class="text-btn-container d-flex">
          <button class="text-btn-with-icon" onclick="deleteTask('${task.id}'); toggleOverlay('#details-overlay')">
            <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3C0.716667 3 0.479167 2.90417 0.2875 2.7125C0.0958333 2.52083 0 2.28333 0 2C0 1.71667 0.0958333 1.47917 0.2875 1.2875C0.479167 1.09583 0.716667 1 1 1H5C5 0.716667 5.09583 0.479167 5.2875 0.2875C5.47917 0.0958333 5.71667 0 6 0H10C10.2833 0 10.5208 0.0958333 10.7125 0.2875C10.9042 0.479167 11 0.716667 11 1H15C15.2833 1 15.5208 1.09583 15.7125 1.2875C15.9042 1.47917 16 1.71667 16 2C16 2.28333 15.9042 2.52083 15.7125 2.7125C15.5208 2.90417 15.2833 3 15 3V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM3 3V16H13V3H3ZM5 13C5 13.2833 5.09583 13.5208 5.2875 13.7125C5.47917 13.9042 5.71667 14 6 14C6.28333 14 6.52083 13.9042 6.7125 13.7125C6.90417 13.5208 7 13.2833 7 13V6C7 5.71667 6.90417 5.47917 6.7125 5.2875C6.52083 5.09583 6.28333 5 6 5C5.71667 5 5.47917 5.09583 5.2875 5.2875C5.09583 5.47917 5 5.71667 5 6V13ZM9 13C9 13.2833 9.09583 13.5208 9.2875 13.7125C9.47917 13.9042 9.71667 14 10 14C10.2833 14 10.5208 13.9042 10.7125 13.7125C10.9042 13.5208 11 13.2833 11 13V6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6V13Z" fill="#4589FF"/>
            </svg>
            Delete
          </button>
          <div class="vertical-divider"></div>
          <button class="text-btn-with-icon" onclick="editTask('${task.id}')">
            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 16.25H3.4L12.025 7.625L10.625 6.225L2 14.85V16.25ZM16.3 6.175L12.05 1.975L13.45 0.575C13.8333 0.191667 14.3042 0 14.8625 0C15.4208 0 15.8917 0.191667 16.275 0.575L17.675 1.975C18.0583 2.35833 18.2583 2.82083 18.275 3.3625C18.2917 3.90417 18.1083 4.36667 17.725 4.75L16.3 6.175ZM14.85 7.65L4.25 18.25H0V14L10.6 3.4L14.85 7.65Z" fill="#4589FF"/>
            </svg>
            Edit
          </button>
        </div>
      </div>
    </div>
  `;
}


/**
 * Returns HTML for a single subtask list item.
 * @function getSubtaskItemTemplate
 */
function getSubtaskItemTemplate(index, text) {
  return `
      <li class="subtask-item" data-subtask-index="${index}" id="subtask-item-${index}">
        <span class="subtask-text">${text}</span>
        <div class="form-btn-group">
          <button type="button" class="form-btn-round" onclick="editSubtask(${index})">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z" fill="#4589FF"/>
            </svg>
          </button>
          <div class="vertical-divider"></div>
          <button type="button" class="form-btn-round" onclick="removeSubtask(${index}, this.closest('.subtask-item'))">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6C4.71667 6 4.47917 5.90417 4.2875 5.7125C4.09583 5.52083 4 5.28333 4 5C4 4.71667 4.09583 4.47917 4.2875 4.2875C4.47917 4.09583 4.71667 4 5 4H9C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4H19C19.2833 4 19.5208 4.09583 19.7125 4.2875C19.9042 4.47917 20 4.71667 20 5C20 5.28333 19.9042 5.52083 19.7125 5.7125C19.5208 5.90417 19.2833 6 19 6V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM7 6V19H17V6H7ZM9 16C9 16.2833 9.09583 16.5208 9.2875 16.7125C9.47917 16.9042 9.71667 17 10 17C10.2833 17 10.5208 16.9042 10.7125 16.7125C10.9042 16.5208 11 16.2833 11 16V9C11 8.71667 10.9042 8.47917 10.7125 8.2875C10.5208 8.09583 10.2833 8 10 8C9.71667 8 9.47917 8.09583 9.2875 8.2875C9.09583 8.47917 9 8.71667 9 9V16ZM13 16C13 16.2833 13.0958 16.5208 13.2875 16.7125C13.4792 16.9042 13.7167 17 14 17C14.2833 17 14.5208 16.9042 14.7125 16.7125C14.9042 16.5208 15 16.2833 15 16V9C15 8.71667 14.9042 8.47917 14.7125 8.2875C14.5208 8.09583 14.2833 8 14 8C13.7167 8 13.4792 8.09583 13.2875 8.2875C13.0958 8.47917 13 8.71667 13 9V16Z" fill="#4589FF"/>
            </svg>
          </button>
        </div>
      </li>
    `;
}


/**
 * Returns HTML for the inline subtask edit container.
 * @function getSubtaskEditTemplate
 */
function getSubtaskEditTemplate(index, text) {
  return `
    <div class="subtask-edit-container" id="subtask-edit-${index}">
      <div class="subtask-input-container">
        <input
        type="text"
        id="subtask-edit-input-${index}"
        class="subtask-edit-input container-with-form-btn-group form-input"
        value="${text}"
        />
        <div class="form-btn-group">
          <button type="button" class="form-btn-round" onclick="saveSubtaskEdit(${index})">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.55002 15.15L18.025 6.675C18.225 6.475 18.4625 6.375 18.7375 6.375C19.0125 6.375 19.25 6.475 19.45 6.675C19.65 6.875 19.75 7.1125 19.75 7.3875C19.75 7.6625 19.65 7.9 19.45 8.1L10.25 17.3C10.05 17.5 9.81669 17.6 9.55002 17.6C9.28336 17.6 9.05002 17.5 8.85002 17.3L4.55002 13C4.35002 12.8 4.25419 12.5625 4.26252 12.2875C4.27086 12.0125 4.37502 11.775 4.57502 11.575C4.77502 11.375 5.01252 11.275 5.28752 11.275C5.56252 11.275 5.80002 11.375 6.00002 11.575L9.55002 15.15Z" fill="#4589FF"/>
            </svg>
          </button>
          <div class="vertical-divider"></div>
          <button type="button" class="form-btn-round" onclick="cancelSubtaskEdit(${index})">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 13.4L7.09999 18.3C6.91665 18.4834 6.68332 18.575 6.39999 18.575C6.11665 18.575 5.88332 18.4834 5.69999 18.3C5.51665 18.1167 5.42499 17.8834 5.42499 17.6C5.42499 17.3167 5.51665 17.0834 5.69999 16.9L10.6 12L5.69999 7.10005C5.51665 6.91672 5.42499 6.68338 5.42499 6.40005C5.42499 6.11672 5.51665 5.88338 5.69999 5.70005C5.88332 5.51672 6.11665 5.42505 6.39999 5.42505C6.68332 5.42505 6.91665 5.51672 7.09999 5.70005L12 10.6L16.9 5.70005C17.0833 5.51672 17.3167 5.42505 17.6 5.42505C17.8833 5.42505 18.1167 5.51672 18.3 5.70005C18.4833 5.88338 18.575 6.11672 18.575 6.40005C18.575 6.68338 18.4833 6.91672 18.3 7.10005L13.4 12L18.3 16.9C18.4833 17.0834 18.575 17.3167 18.575 17.6C18.575 17.8834 18.4833 18.1167 18.3 18.3C18.1167 18.4834 17.8833 18.575 17.6 18.575C17.3167 18.575 17.0833 18.4834 16.9 18.3L12 13.4Z" fill="#4589FF"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;
}
