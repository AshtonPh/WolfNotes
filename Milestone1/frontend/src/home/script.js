import '@material/web/tabs/primary-tab'
import '@material/web/tabs/tabs'
import '@material/web/iconbutton/icon-button'
import '@material/web/icon/icon'
import '@material/web/list/list'
import '@material/web/list/list-item'
import '@material/web/chips/chip-set'
import '@material/web/chips/filter-chip'
import '@material/web/chips/input-chip'
import '@material/web/chips/assist-chip'
import '@material/web/textfield/outlined-text-field'
import '@material/web/textfield/filled-text-field'
import '@material/web/menu/menu'
import '@material/web/menu/menu-item'

const main = document.getElementsByTagName('main')[0];
const body = document.getElementsByTagName('body')[0];
let scrollDebounce;
main.onscroll = (ev) => {
    clearTimeout(scrollDebounce);
    scrollDebounce = setTimeout(() => {
        if (main.scrollTop > 40) {
            if (!body.classList.contains("scrolled"))
                body.classList.add("scrolled");
        }
        else if (body.classList.contains("scrolled")) {
            body.classList.remove("scrolled");
        }
    }, 20)
}