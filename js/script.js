window.addEventListener('DOMContentLoaded', function() {
    const logoSlide = document.getElementById('logo-slide');
    setTimeout(() => {
        logoSlide.style.alignItems = 'flex-start';
        logoSlide.style.justifyContent = 'flex-start';
        logoSlide.style.width = '320px';
        logoSlide.style.height = '120px';
        logoSlide.style.top = '0';
        logoSlide.style.left = '0';
        logoSlide.style.background = 'transparent';
        logoSlide.style.padding = '32px';
    }, 500);
});
