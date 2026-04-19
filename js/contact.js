/**
 * @fileoverview Contact dataset and utilities for the app.
 * Provides demo contacts used across modules and UIs.
 * @version 1.0.0
 * @author Join-1325 Development Team
 */
let contacts = [
  { name: "John Doe", email: "john.doe@example.com", phone: "123-456-7890" },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "123-456-7890",
  },
  {
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    phone: "123-456-7890",
  },
  {
    name: "Brian Adams",
    email: "brian.adams@example.com",
    phone: "234-567-8901",
  },
  {
    name: "Cathy Brown",
    email: "cathy.brown@example.com",
    phone: "345-678-9012",
  },
  {
    name: "David Clark",
    email: "david.clark@example.com",
    phone: "456-789-0123",
  },
  {
    name: "Evelyn Davis",
    email: "evelyn.davis@example.com",
    phone: "567-890-1234",
  },
  {
    name: "Frank Evans",
    email: "frank.evans@example.com",
    phone: "678-901-2345",
  },
  {
    name: "Grace Foster",
    email: "grace.foster@example.com",
    phone: "789-012-3456",
  },
  {
    name: "Henry Green",
    email: "henry.green@example.com",
    phone: "890-123-4567",
  },
  {
    name: "Irene Harris",
    email: "irene.harris@example.com",
    phone: "901-234-5678",
  },
  {
    name: "Jack Ingram",
    email: "jack.ingram@example.com",
    phone: "012-345-6789",
  },
  {
    name: "Karen Jones",
    email: "karen.jones@example.com",
    phone: "123-456-7891",
  },
  { name: "Liam King", email: "liam.king@example.com", phone: "234-567-8902" },
  { name: "Mona Lee", email: "mona.lee@example.com", phone: "345-678-9013" },
  {
    name: "Nathan Moore",
    email: "nathan.moore@example.com",
    phone: "456-789-0124",
  },
  {
    name: "Olivia Nelson",
    email: "olivia.nelson@example.com",
    phone: "567-890-1235",
  },
  {
    name: "Paul Owens",
    email: "paul.owens@example.com",
    phone: "678-901-2346",
  },
  {
    name: "Quincy Price",
    email: "quincy.price@example.com",
    phone: "789-012-3457",
  },
  {
    name: "Rachel Quinn",
    email: "rachel.quinn@example.com",
    phone: "890-123-4568",
  },
  {
    name: "Samuel Reed",
    email: "samuel.reed@example.com",
    phone: "901-234-5679",
  },
  {
    name: "Tina Scott",
    email: "tina.scott@example.com",
    phone: "012-345-6790",
  },
];

let activeContactIndex = null;

const avatarColors = [
  "#FF7A00",
  "#9327FF",
  "#6E52FF",
  "#FC71FF",
  "#FFBB2B",
  "#1FD7C1",
  "#462F8A",
  "#FF4646",
  "#00BEE8",
];

/**
 * Handles the getAvatarColor workflow.
 * @function getAvatarColor
 */
function getAvatarColor(name) {
  const firstLetter = name.charAt(0).toUpperCase();
  const charCode = firstLetter.charCodeAt(0);
  const colorIndex = (charCode - 65) % avatarColors.length;
  return avatarColors[colorIndex];
}


/**
 * Handles the groupContactsByAlphabet workflow.
 * @function groupContactsByAlphabet
 */
function groupContactsByAlphabet() {
  const sorted = [...contacts].sort((a, b) => a.name.localeCompare(b.name));
  return groupSortedContactsByLetter(sorted);
}


/**
 * Groups an alphabetically sorted contacts array by first letter.
 * @function groupSortedContactsByLetter
 */
function groupSortedContactsByLetter(sorted) {
  const grouped = {};
  for (let i = 0; i < sorted.length; i++) {
    const contact = sorted[i];
    const letter = contact.name.charAt(0).toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push({ contact, originalIndex: contacts.indexOf(contact) });
  }
  return grouped;
}


/**
 * Handles the renderContactList workflow.
 * @function renderContactList
 */
function renderContactList() {
  let contactList = document.getElementById("contact-list");
  contactList.innerHTML = "";

  let groupedContacts = groupContactsByAlphabet();
  let alphabeticalKeys = Object.keys(groupedContacts);

  for (let i = 0; i < alphabeticalKeys.length - 1; i++) {
    for (let j = 0; j < alphabeticalKeys.length - i - 1; j++) {
      if (alphabeticalKeys[j] > alphabeticalKeys[j + 1]) {
        let temp = alphabeticalKeys[j];
        alphabeticalKeys[j] = alphabeticalKeys[j + 1];
        alphabeticalKeys[j + 1] = temp;
      }
    }
  }

  for (let i = 0; i < alphabeticalKeys.length; i++) {
    let letter = alphabeticalKeys[i];
    contactList.innerHTML += getAlphabetHeaderTemplate(letter);
    let contactsInGroup = groupedContacts[letter];
    for (let j = 0; j < contactsInGroup.length; j++) {
      let contactItem = contactsInGroup[j];
      let contact = contactItem.contact;
      let originalIndex = contactItem.originalIndex;
      contactList.innerHTML += getContactCardTemplate(contact, originalIndex);
    }
  }
}

/**
 * Handles the showContactDetails workflow.
 * @function showContactDetails
 */
function showContactDetails(index) {
  activeContactIndex = index;
  renderContactList();
  const contact = contacts[index];
  const avatarColor = getAvatarColor(contact.name);
  const initials = getInitials(contact.name);
  const contactDetails = document.getElementById("contact-details-content");
  contactDetails.style.display = "block";
  contactDetails.innerHTML = getContactDetailsTemplate(
    contact,
    index,
    avatarColor,
    initials
  );
}

/**
 * Handles the backToContactList workflow.
 * @function backToContactList
 */
function backToContactList() {
  const contactDetails = document.getElementById("contact-details-content");
  contactDetails.style.display = "none";
  activeContactIndex = null;
  renderContactList();
}

/**
 * Handles the editContact workflow.
 * @function editContact
 */
function editContact(index) {
const avatarColor = getAvatarColor(contacts[index].name);
  const contact = contacts[index];
  const form = document.getElementById("edit-contact-form");
  form.onsubmit = (event) => updateContact(event, index);
  const initials = getInitials(contact.name);
  form.innerHTML = getEditContactFormTemplate(contact, avatarColor, initials);
  toggleOverlay("#edit-contact-menu");
}

/**
 * Handles the updateContact workflow.
 * @function updateContact
 */
function updateContact(event, editContactIndex) {
  event.preventDefault();
  if (!validateContactForm(true)) return;
  const nameInput = document.getElementById("edit-contact-name");
  const emailInput = document.getElementById("edit-contact-email");
  const phoneInput = document.getElementById("edit-contact-phone");

  const updatedContact = {
    name: nameInput.value,
    email: emailInput.value,
    phone: phoneInput.value,
  };

  contacts[editContactIndex] = updatedContact;
  activeContactIndex = editContactIndex;
  renderContactList();
  showContactDetails(editContactIndex);
  closeAllMenus();
  showContactSuccessOverlay("contact-edit-success-overlay");
}

/**
 * Handles the deleteContact workflow.
 * @function deleteContact
 */
function deleteContact(index) {
  contacts.splice(index, 1);
  renderContactList();
  closeAllMenus();
  const contactDetails = document.getElementById("contact-details-content");
  contactDetails.innerHTML = "<p>Select a contact to view details</p>";
  showContactSuccessOverlay("contact-delete-success-overlay");
}

/**
 * Handles the addContact workflow.
 * @function addContact
 */
function addContact(event) {
  event.preventDefault();
  if (!validateContactForm(false)) return;
  const nameInput = document.getElementById("add-contact-name");
  const emailInput = document.getElementById("add-contact-email");
  const phoneInput = document.getElementById("add-contact-phone");

  const newContact = {
    name: nameInput.value,
    email: emailInput.value,
    phone: phoneInput.value,
  };

  contacts.push(newContact);
  renderContactList();
  const newContactIndex = contacts.length - 1;
  showContactDetails(newContactIndex);
  closeAllMenus();
  document.getElementById("add-contact-form").reset();
  clearContactFormErrors(false);
  showContactSuccessOverlay("contact-add-success-overlay");
}

/**
 * Shows a success overlay for contact actions.
 * @function showContactSuccessOverlay
 * @param {string} overlayId - ID of the overlay element to show.
 */
function showContactSuccessOverlay(overlayId) {
  const overlay = document.getElementById(overlayId);
  if (!overlay) return;
  overlay.classList.remove("d-none");
  setTimeout(() => overlay.classList.add("d-none"), 1500);
}

/**
 * Handles the openDropdownMenuMobile workflow.
 * @function openDropdownMenuMobile
 */
function openDropdownMenuMobile(event) {
  if (event) {
    event.stopPropagation();
  }
  const dropdownMenu = document.getElementById("dropdown-menu-mobile");
  dropdownMenu.classList.toggle("open");
}

/**
 * Handles body click interactions for contact page.
 * @param {Event} event - Click event from body.
 */
function handleContactBodyClick(event) {
  const dropdownMenu = document.getElementById("dropdown-menu-mobile");
  if (!dropdownMenu || !dropdownMenu.classList.contains("open")) {
    return;
  }

  if (!event.target.closest(".mobile-contact-actions")) {
    dropdownMenu.classList.remove("open");
  }
}
