window.addEventListener('DOMContentLoaded', function() {
    const logoSlide = document.getElementById('logo-slide');
    // Start in center
    logoSlide.style.transform = 'translate(0, 0)';
    setTimeout(() => {
        // Slide to top left
        logoSlide.style.transform = 'translate(-40vw, -40vh) scale(0.5)';
        logoSlide.style.background = 'transparent';
    }, 500);
});
