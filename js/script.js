/**
 * @fileoverview Core session management and common UI helpers.
 * Handles login enforcement, logout, and user dropdown toggling.
 * @version 1.0.0
 * @author Join-1325 Development Team
 */
// Color change is now performed in the Loadingscreen() function after generation

/**
 * Checks if user is logged in
 * Redirects to login page if no active session exists
 * @returns {boolean} True if user is logged in, false otherwise
 */
function checkSession() {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn');

  if (!isLoggedIn || isLoggedIn !== 'true') {
    window.location.href = '/html/login.html';
    return false;
  }
  return true;
}

/**
 * Retrieves the user's initials from their name for avatar display.
 * @param {string} name - The full name of the user.
 * @returns {string} The initials derived from the user's name.
 */
function getUserAvatar() {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn');
  if (isLoggedIn || isLoggedIn == 'true') {
    const userName = sessionStorage.getItem('userName');
    const userAvatarNameElement = document.getElementById('user-avatar-name');
    userAvatarNameElement.textContent = getInitials(userName);
  }
  setActiveSidebarLink();
}


/**
 * Handles the getInitials workflow.
 * @function getInitials
 */
function getInitials(name) {
  const parts = name.trim().split(/(?=[A-Z])/);
  if (parts.length >= 2) {
    return parts[0].charAt(0).toUpperCase() + parts[parts.length - 1].charAt(0).toUpperCase();
  }
  return parts[0].charAt(0).toUpperCase();
}


/**
 * Initializes session-protected pages
 * Checks session and prevents page load if not authenticated
 */
function initProtectedPage() {
  const currentPage = window.location.pathname;
  const protectedPages = ['/index.html', '/html/add-task.html', '/html/board.html', '/html/contacts.html'];

  const isProtectedPage = protectedPages.some(page => currentPage.includes(page)) || currentPage=='/';

  if (isProtectedPage) {
    checkSession();
  }
}


/**
 * Logs out the user
 * Clears session storage and redirects to login page
 */
function logout() {
  sessionStorage.clear();
  window.location.href = '/html/login.html';
  sessionStorage.setItem('skipAnimation', 'true');
}


/**
 * Toggles the user dropdown menu
 * @param {Event} event - The click event
 */
function toggleUserDropdown(event) {
  event.stopPropagation();
  const dropdown = document.getElementById('user-dropdown-menu');
  const userAvatar = document.getElementById('user-avatar-name');
  dropdown.classList.toggle('d-none');
  userAvatar.classList.toggle('active');
}


/**
 * Closes the user dropdown menu when clicking outside
 */
function handleOutsideClick(event) {
  const dropdown = document.getElementById('user-dropdown-menu');
  const userAvatar = document.querySelector('.user-avatar');
  const userAvatarName = document.getElementById('user-avatar-name');

  if (dropdown && !dropdown.classList.contains('d-none')) {
    // Check if click is outside both dropdown and avatar
    if (!dropdown.contains(event.target) && !userAvatar.contains(event.target)) {
      dropdown.classList.add('d-none');
      userAvatarName.classList.remove('active');
    }
  }
}

// Assign the function to document.onclick
document.onclick = handleOutsideClick;

// Initialize session check on page load
initProtectedPage();

window.__joinApplyFinalLogoState = false;

/**
 * Applies final logo position and size for skipped login animation.
 */
function applyFinalLoginLogoState() {
  const vp = getLoginLogoViewports();
  const pos = getLoginLogoFinalPosition(vp);
  applyLoginLogoStyles(document.getElementById("loader-image-white"), pos);
}


/**
 * Returns the viewport flags relevant to the login logo placement.
 * @function getLoginLogoViewports
 */
function getLoginLogoViewports() {
  return {
    mobile: window.matchMedia("(max-width: 768px)").matches,
    short: window.matchMedia("(max-height: 836px)").matches,
    tablet: window.matchMedia("(max-width: 1028px)").matches,
    small: window.matchMedia("(max-width: 396px)").matches,
    verySmall: window.matchMedia("(max-width: 340px)").matches,
    lowHeight: window.matchMedia("(max-height: 965px)").matches,
  };
}


/**
 * Computes the final top/leftOffset/width/height for the login logo.
 * @function getLoginLogoFinalPosition
 */
function getLoginLogoFinalPosition(vp) {
  let top = "80px";
  let leftOffset = "77px";
  if (vp.tablet) { top = "37px"; leftOffset = "38px"; }
  if (vp.small) leftOffset = "32px";
  if (vp.verySmall) leftOffset = "22px";
  if (vp.lowHeight) { top = "20px"; leftOffset = "20px"; }
  const width = vp.mobile ? (vp.short ? "32px" : "64px") : "101px";
  const height = vp.mobile ? (vp.short ? "39px" : "78px") : "122px";
  return { top, leftOffset, width, height };
}


/**
 * Writes the computed logo position/size directly to the element's style.
 * @function applyLoginLogoStyles
 */
function applyLoginLogoStyles(el, pos) {
  el.style.position = "absolute";
  el.style.top = pos.top;
  el.style.left = `calc((100vw - min(100vw, 1920px)) / 2 + ${pos.leftOffset})`;
  el.style.width = pos.width;
  el.style.height = pos.height;
  el.style.transform = "none";
}

/**
 * Highlights the sidebar nav link that matches the current page.
 */
function setActiveSidebarLink() {
  const path = window.location.pathname;
  document.querySelectorAll('.btn-menu').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const page = href.split('/').pop();
    const isIndex = page === 'index.html' && (path === '/' || path.endsWith('/index.html'));
    if (isIndex || (page && path.endsWith(page))) {
      link.classList.add('active');
    }
  });
}

/**
 * Handles resize events on login page.
 */
function handleLoginLogoResize() {
  window.requestAnimationFrame(applyFinalLoginLogoState);
}

/**
 * Handles the Loadingscreen workflow.
 * @function Loadingscreen
 */
function Loadingscreen() {
  const loader = document.getElementById("loader");
  const skipAnimation = sessionStorage.getItem("skipAnimation");
  if (skipAnimation === "true") {
    sessionStorage.removeItem("skipAnimation");
    renderSkippedLoadingscreen(loader);
    return;
  }
  loader.innerHTML = getLoadingscreen();
}


/**
 * Renders the loader in its final (post-animation) state when the animation is skipped.
 * @function renderSkippedLoadingscreen
 */
function renderSkippedLoadingscreen(loader) {
  loader.style.background = "transparent";
  loader.innerHTML = getLoadingscreen();
  const logoElement = document.getElementById("loader-image-white");
  if (!logoElement) return;
  logoElement.style.animation = "none";
  window.__joinApplyFinalLogoState = true;
  applyFinalLoginLogoState();
  forceLogoPathsBlue(logoElement);
}


/**
 * Forces the logo's path elements to blue and disables their CSS animations.
 * @function forceLogoPathsBlue
 */
function forceLogoPathsBlue(logoElement) {
  const paths = logoElement.children;
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    if (path.tagName.toLowerCase() === 'path') {
      path.style.fill = "#4589FF";
      path.style.animation = "none";
    }
  }
}


/**
 * Handles the getLoadingscreen workflow.
 * @function getLoadingscreen
 */
function getLoadingscreen() {
  return `
    <svg width="101" height="122" viewBox="0 0 101 122" fill="none" xmlns="http://www.w3.org/2000/svg" id="loader-image-white" class="loader-image login-logo">
      <path d="M71.6721 0H49.5143V25.4923H71.6721V0Z" fill="#FFFFFF"/>
      <path d="M49.5142 46.2251H71.6721V82.1779C71.7733 90.8292 69.3112 99.3153 64.5986 106.557C59.9455 113.594 50.963 121.966 34.3446 121.966C16.2434 121.966 5.69286 113.406 0 108.715L13.9765 91.4743C19.533 96.0112 24.885 99.7435 34.4299 99.7435C41.6567 99.7435 44.5372 96.7988 46.2247 94.2307C48.5186 90.6637 49.7052 86.4923 49.6335 82.2464L49.5142 46.2251Z" fill="#FFFFFF"/>
      <path d="M38.2137 30.1318H16.0559V52.3884H38.2137V30.1318Z" fill="#FFFFFF"/>
      <path d="M83.2793 111.522C83.2793 116.265 80.8761 118.815 77.5183 118.815C74.1605 118.815 71.9618 115.785 71.9618 111.762C71.9618 107.739 74.2287 104.554 77.7058 104.554C81.1829 104.554 83.2793 107.687 83.2793 111.522ZM74.5355 111.711C74.5355 114.57 75.6775 116.675 77.6376 116.675C79.5977 116.675 80.7056 114.45 80.7056 111.539C80.7056 108.988 79.6829 106.592 77.6376 106.592C75.5923 106.592 74.5355 108.903 74.5355 111.711Z" fill="#FFFFFF"/>
      <path d="M87.6768 104.76V118.593H85.2224V104.760H87.6768Z" fill="#FFFFFF"/>
      <path d="M90.3358 118.593V104.76H93.0629L95.9946 110.461C96.7493 111.952 97.4207 113.483 98.0058 115.049C97.8524 113.337 97.7843 111.368 97.7843 109.177V104.76H100.034V118.593H97.4945L94.5288 112.772C93.7436 111.243 93.0437 109.671 92.4323 108.064C92.4323 109.776 92.5516 111.711 92.5516 114.09V118.576L90.3358 118.593Z" fill="#FFFFFF"/>
    </svg>
  `;
}
