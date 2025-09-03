window.addEventListener('DOMContentLoaded', function() {
    const logoSlide = document.getElementById('logo-slide');
    document.body.classList.add('no-scrollbar');
    logoSlide.style.transform = 'translate(0, 0)';
    setTimeout(() => {
        logoSlide.style.transform = 'translate(-40vw, -40vh) scale(0.5)';
        setTimeout(() => {
            document.body.classList.remove('no-scrollbar');
        }, 1000);
    }, 500);
});
