/**
 * @fileoverview Static pages renderer for unauthenticated users.
 * Initializes sidebar and header content when no session is active.
 * @version 1.0.0
 * @author Join-1325 Development Team
 */
/**
 * Initialize static pages based on user authentication status
 * Checks sessionStorage for login status and renders appropriate UI
 * If user is not logged in, displays login sidebar and empty header
 */
function initStaticPages() {
	const isLoggedIn = sessionStorage.getItem("isLoggedIn");
	if (isLoggedIn === "true") {
		return;
	} else {
		renderLoginSidbar();
		renderEmptyHeader();
	}
}

/**
 * Create login button HTML
 * @returns {string} HTML string for the login button with image
 */
function createLoginButton() {
	return `
		<div>
			<a class="btn-menu" href="./login.html">
				<img src="../assets/icon/sign/login.svg" alt="Login Icon" />
				Log In
			</a>
		</div>
	`;
}

/**
 * Create sidebar links HTML for Privacy Policy and Legal Notice
 * @returns {string} HTML string for the sidebar links
 */
function createSidebarLinks() {
	return `
		<div class="sidebar-links">
			<a href="./datenschutz.html">Privacy Policy</a>
			<a href="./legalnotice.html">Legal Notice</a>
		</div>
	`;
}

/**
 * Render login sidebar for non-authenticated users
 * Assembles login button and sidebar links into the empty navigation
 */
function renderLoginSidbar() {
	const emptySidebar = document.getElementById("sidebar-nav");
	emptySidebar.classList.remove("sidenav");
	emptySidebar.innerHTML = "";
	emptySidebar.innerHTML = `
		<div class="empty-nav">
			${createLoginButton()}
			${createSidebarLinks()}
		</div>
	`;
}

/**
 * Render empty header for non-authenticated users
 * Displays only the project title without user menu or avatar
 */
function renderEmptyHeader() {
	const userHeadere = document.getElementById("menu-user");
	userHeadere.innerHTML = "";
	userHeadere.innerHTML = `<p>Kanban Project Management Tool</p>`;
}

