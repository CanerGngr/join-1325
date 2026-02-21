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
    let addTaskMenu = document.getElementById('add-task-menu');
    let editContactMenu = document.getElementById('edit-contact-menu');
    let addContactMenu = document.getElementById('add-contact-menu');
    let detailsOverlay = document.getElementById('details-overlay');
    let overlay = document.getElementById('blur-overlay');

    if (addTaskMenu) {
        addTaskMenu.classList.remove('open');
    }
    if (editContactMenu) {
        editContactMenu.classList.remove('open');
    }
    if (addContactMenu) {
        addContactMenu.classList.remove('open');
    }
    if (detailsOverlay) {
        detailsOverlay.classList.remove('open');
    }
    if (overlay) {
        overlay.classList.remove('active');
    }
}
