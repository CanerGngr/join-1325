// Main JavaScript for Join Project

// Utility Functions
function showElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('d-none');
        element.classList.add('d-block');
    }
}

function hideElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('d-block');
        element.classList.add('d-none');
    }
}

function toggleElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.toggle('d-none');
    }
}

// Initialize application
function init() {
    console.log('Join application initialized');
    // Add initialization code here
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', init);