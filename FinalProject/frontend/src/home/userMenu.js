const userMenu = document.getElementById('user-menu');
const userPicture = document.getElementById('user-picture');

document.getElementById('um-logout').onclick = () => {
    api.req('/auth/signout', {method: 'POST'}).then(() => document.location.href = "/signin")
}

userPicture.onclick = (ev) => {
    userMenu.open = !userMenu.open;
    ev.stopPropagation();
}