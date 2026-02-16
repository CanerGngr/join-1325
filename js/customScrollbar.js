/**
 * @fileoverview Custom scrollbar for mobile (mouse-only) pages.
 * Implements draggable thumb synced with window scroll.
 * @version 1.0.0
 * @author Join-1325 Development Team
 */
// Custom Scrollbar for Mobile (Mouse only - no touch support)
let scrollbar, thumb, isDragging, startY, startScrollTop;

/**
 * Get scrollbar elements from the DOM
 * @returns {boolean} True if both scrollbar and thumb elements exist, false otherwise
 */
function getScrollbarElements() {
	scrollbar = document.querySelector(".custom-scrollbar");
	thumb = document.querySelector(".custom-scrollbar-thumb");
	return scrollbar && thumb;
}

/**
 * Update thumb position based on current scroll position
 * Calculates the thumb position accounting for track top (205px) and thumb height (48px)
 * to prevent thumb from going off-screen at the bottom
 */
function updateThumbPosition() {
	if (!thumb) return;
	const scrollHeight = document.documentElement.scrollHeight;
	const clientHeight = document.documentElement.clientHeight;
	const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
	const trackTop = 205;
	const thumbHeight = 48;
	const maxThumbTop = window.innerHeight - trackTop - thumbHeight;
	const thumbTop = scrollPercentage * maxThumbTop;
	thumb.style.top = thumbTop + "px";
}

/**
 * Handle mouse down event on scrollbar thumb
 * Initiates drag operation and stores initial positions
 * @param {MouseEvent} e - The mouse event object
 */
function handleMouseDown(e) {
	isDragging = true;
	startY = e.clientY;
	startScrollTop = window.pageYOffset || document.documentElement.scrollTop;
}

/**
 * Handle mouse move event during thumb drag
 * Calculates scroll position based on thumb movement
 * @param {MouseEvent} e - The mouse event object
 */
function handleMouseMove(e) {
	if (!isDragging) return;
	const deltaY = e.clientY - startY;
	const scrollHeight = document.documentElement.scrollHeight;
	const clientHeight = document.documentElement.clientHeight;
	const trackTop = 205;
	const thumbHeight = 48;
	const maxThumbTop = window.innerHeight - trackTop - thumbHeight;
	const scrollAmount = (deltaY / maxThumbTop) * (scrollHeight - clientHeight);
	window.scrollTo(0, startScrollTop + scrollAmount);
}

/**
 * Handle mouse up event to stop dragging
 * Ends the drag operation
 */
function handleMouseUp() {
	isDragging = false;
}

/**
 * Setup mouse events for dragging functionality
 * Attaches mousedown, mousemove, and mouseup event handlers
 */
function setupMouseEvents() {
	thumb.onmousedown = handleMouseDown;
	document.onmousemove = handleMouseMove;
	document.onmouseup = handleMouseUp;
}

/**
 * Attach scroll and resize events to update thumb position
 * Also sets initial thumb position on page load
 */
function attachScrollbarEvents() {
	window.onscroll = updateThumbPosition;
	window.onresize = updateThumbPosition;
	// Initial position
	updateThumbPosition();
}

/**
 * Main initialization function for custom scrollbar
 * Only initializes on mobile screens (width <= 500px)
 * Sets up all event handlers and initial state
 */
function initCustomScrollbar() {
	if (window.innerWidth > 500) return;
	if (!getScrollbarElements()) return;
	isDragging = false;
	startY = 0;
	startScrollTop = 0;
	setupMouseEvents();
	attachScrollbarEvents();
}

// Initialize on page load
if (document.readyState === "loading") {
	document.onreadystatechange = () => {
		if (document.readyState === "complete") {
			initCustomScrollbar();
		}
	};
} else {
	initCustomScrollbar();
}
