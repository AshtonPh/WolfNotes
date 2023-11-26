const navigationMenu = document.getElementById('navigation-menu');
const navigationMenuBackground = document.getElementById('navigation-menu-background');
const navigationButton = document.getElementById('navigation-menu-button');
const navHome = document.getElementById('nav-home');
const navLogout = document.getElementById('nav-logout');

function open() {
    navigationMenu.classList.add("open");
    navigationMenuBackground.classList.add("open");
}

function close() {
    navigationMenu.classList.remove("open");
    navigationMenuBackground.classList.remove("open");
}

function logout() {
    api.req('/auth/signout', {method: 'POST'})
        .then(() => document.location.href = "/signin")
}

navigationButton.onclick = open;
navHome.onclick = navigationMenuBackground.onclick = close;
navLogout.onclick = logout;