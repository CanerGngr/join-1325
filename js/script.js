function animateLogo() {
  const logoSlide = document.getElementById("logo-slide");
  const svgLogo = logoSlide.querySelector("svg");
  const logoPaths = svgLogo.querySelectorAll("path");

  // Startposition: zentriert, Originalgröße (statisch in CSS)
  logoPaths.forEach((path) => path.setAttribute("fill", "white"));

  setTimeout(() => {
    // Animation: Logo verschiebt sich nach links oben und schrumpft
    svgLogo.style.transition =
      "width 1s cubic-bezier(.77,0,.18,1), height 1s cubic-bezier(.77,0,.18,1), left 1s cubic-bezier(.77,0,.18,1), top 1s cubic-bezier(.77,0,.18,1)";
    svgLogo.style.width = "100px";
    svgLogo.style.height = (100 * 324) / 265 + "px"; // Ratio beibehalten
    logoPaths.forEach((path) => path.setAttribute("fill", "#4589FF"));
    logoSlide.style.background = "transparent";

    setTimeout(() => {
      // Endposition: SVG absolut positionieren, Abstand 77px/80px, Logo bleibt klein und links oben
      svgLogo.style.position = "absolute";
      svgLogo.style.left = "77px";
      svgLogo.style.top = "80px";
      svgLogo.style.width = "100px";
      svgLogo.style.height = (100 * 324) / 265 + "px";
      logoPaths.forEach((path) => path.setAttribute("fill", "#4589FF"));
    }, 1000);
  }, 500);
}
function Loadingscreen() {
  if (window.innerWidth <= 600) {
    loader.innerHTML = getLoadingscreenMobile();
  } else {
    loader.innerHTML = getLoadingscreenDesktop();
  }
}


function getLoadingscreenMobile() {
  return `
    <img src="../assets/img/logo-black.svg" alt="Logo" id="loader-image-black" class="loader-image login-logo" />
  `;
}


function getLoadingscreenDesktop() {
  return `
    <img src="../assets/img/logo-black.svg" alt="Logo" id="loader-image-black" class="loader-image" />
  `;
}
