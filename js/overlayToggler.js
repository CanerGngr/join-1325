/**
 * @fileoverview Overlay and menu toggling utilities.
 * Controls blur overlay and open/close state of menus and dialogs.
 * @version 1.0.0
 * @author Join-1325 Development Team
 */
function toggleOverlay(menuId) {
    let overlay = document.getElementById('blur-overlay');
    if (overlay) {
        overlay.classList.toggle('active');
    }
    let cleanMenuId = menuId.replace('#', '').replace('.', '');
    let menu = document.getElementById(cleanMenuId);
    if (menu) {
        menu.classList.toggle('open');
    }
}


/**
 * Handles the closeAllMenus workflow.
 * @function closeAllMenus
 */
function closeAllMenus() {
    const menuIds = ['add-task-menu', 'edit-contact-menu', 'add-contact-menu', 'details-overlay'];
    for (let i = 0; i < menuIds.length; i++) removeClassById(menuIds[i], 'open');
    removeClassById('blur-overlay', 'active');
}


/**
 * Removes a CSS class from an element looked up by ID, if it exists.
 * @function removeClassById
 */
function removeClassById(id, className) {
    const el = document.getElementById(id);
    if (el) el.classList.remove(className);
}
