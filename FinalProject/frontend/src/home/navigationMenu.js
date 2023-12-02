import * as api from '../common/js/api';
import * as os from '../common/js/offlineState';

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

async function logout() {
    await api.req('/auth/signout', {method: 'POST'})
    await os.clearAll();
    document.location.href = "/login/";
}

navigationButton.onclick = open;
navHome.onclick = navigationMenuBackground.onclick = close;
navLogout.onclick = logout;